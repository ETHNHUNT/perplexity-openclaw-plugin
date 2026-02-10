#!/usr/bin/env node
/**
 * Search command - Performs web searches
 */

import { createSearchEngine } from '../../perplexity/search-engine.js';
import type { SearchCommandOptions } from '../../types/cli.js';
import { logger } from '../../utils/logger.js';
import { validateOutputFormat } from '../../utils/validators.js';
import { formatError, formatHeader, formatOutput } from '../utils/formatter.js';
import { withSpinner } from '../utils/spinner.js';

/**
 * Main search command handler
 */
export async function searchCommand(query: string, options: SearchCommandOptions): Promise<void> {
  try {
    logger.info({ query, options }, 'Search command started');

    validateOutputFormat(options.output);

    const searchEngine = createSearchEngine();

    const result = await withSpinner(
      'Searching...',
      async () =>
        searchEngine.search({
          query,
          mode: options.mode,
          focus: options.focus as any,
          proSearch: options.pro,
        }),
      'Search completed',
      'Search failed',
    );

    await searchEngine.cleanup();

    if (options.output === 'json') {
      console.log(formatOutput(result, 'json'));
    } else if (options.output === 'table') {
      console.log(formatHeader('Search Results'));
      console.log('');
      console.log(formatOutput({ Answer: result.answer }, 'text'));

      if (result.sources.length > 0) {
        console.log('');
        console.log(formatHeader('Sources'));
        console.log(formatOutput(result.sources, 'table'));
      }

      if (result.relatedQuestions.length > 0) {
        console.log('');
        console.log(formatHeader('Related Questions'));
        result.relatedQuestions.forEach((q, i) => {
          console.log(`${i + 1}. ${q}`);
        });
      }
    } else {
      // Text format (default)
      console.log(formatHeader('Answer'));
      console.log('');
      console.log(result.answer);

      if (result.sources.length > 0) {
        console.log('');
        console.log(formatHeader('Sources'));
        result.sources.forEach((source, i) => {
          console.log(`${i + 1}. ${source.title}`);
          console.log(`   ${source.url}`);
        });
      }

      if (result.relatedQuestions.length > 0) {
        console.log('');
        console.log(formatHeader('Related Questions'));
        result.relatedQuestions.forEach((q, i) => {
          console.log(`${i + 1}. ${q}`);
        });
      }
    }

    logger.info('Search command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Search command failed');
    console.log(
      formatError(`Search failed: ${error instanceof Error ? error.message : String(error)}`),
    );
    process.exit(1);
  }
}
