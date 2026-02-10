#!/usr/bin/env node
/**
 * Research command - Performs deep research
 */

import type { ResearchCommandOptions } from '../../types/cli.js';
import { createSearchEngine } from '../../perplexity/search-engine.js';
import { formatOutput, formatError, formatHeader } from '../utils/formatter.js';
import { withSpinner } from '../utils/spinner.js';
import { logger } from '../../utils/logger.js';
import { validateOutputFormat } from '../../utils/validators.js';

/**
 * Main research command handler
 */
export async function researchCommand(
  topic: string,
  options: ResearchCommandOptions,
): Promise<void> {
  try {
    logger.info({ topic, options }, 'Research command started');

    validateOutputFormat(options.output);

    const searchEngine = createSearchEngine();

    const result = await withSpinner(
      options.deep ? 'Performing deep research...' : 'Researching...',
      async () => searchEngine.research({
        topic,
        deep: options.deep,
        maxDepth: options.maxDepth,
      }),
      'Research completed',
      'Research failed',
    );

    await searchEngine.cleanup();

    if (options.output === 'json') {
      console.log(formatOutput(result, 'json'));
    } else if (options.output === 'table') {
      console.log(formatHeader('Research Summary'));
      console.log('');
      console.log(result.summary);
      
      if (result.sections.length > 0) {
        console.log('');
        console.log(formatHeader('Sections'));
        console.log(formatOutput(result.sections, 'table'));
      }
      
      if (result.sources.length > 0) {
        console.log('');
        console.log(formatHeader('Sources'));
        console.log(formatOutput(result.sources, 'table'));
      }
    } else {
      // Text format (default)
      console.log(formatHeader('Summary'));
      console.log('');
      console.log(result.summary);
      
      if (result.sections.length > 0) {
        console.log('');
        console.log(formatHeader('Details'));
        result.sections.forEach((section) => {
          console.log('');
          console.log(formatHeader(section.title));
          console.log(section.content);
        });
      }
      
      if (result.sources.length > 0) {
        console.log('');
        console.log(formatHeader('Sources'));
        result.sources.forEach((source, i) => {
          console.log(`${i + 1}. ${source.title}`);
          console.log(`   ${source.url}`);
        });
      }
      
      if (result.relatedTopics.length > 0) {
        console.log('');
        console.log(formatHeader('Related Topics'));
        result.relatedTopics.forEach((topic, i) => {
          console.log(`${i + 1}. ${topic}`);
        });
      }
    }

    logger.info('Research command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Research command failed');
    console.log(formatError(`Research failed: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}
