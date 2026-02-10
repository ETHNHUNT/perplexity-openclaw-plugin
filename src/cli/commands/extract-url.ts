#!/usr/bin/env node
/**
 * Extract URL command - Extracts content from URLs
 */

import type { ExtractUrlCommandOptions } from '../../types/cli.js';
import { createSearchEngine } from '../../perplexity/search-engine.js';
import { formatOutput, formatError, formatHeader } from '../utils/formatter.js';
import { withSpinner } from '../utils/spinner.js';
import { logger } from '../../utils/logger.js';
import { validateOutputFormat, validateUrl } from '../../utils/validators.js';

/**
 * Main extract-url command handler
 */
export async function extractUrlCommand(
  url: string,
  options: ExtractUrlCommandOptions,
): Promise<void> {
  try {
    logger.info({ url, options }, 'Extract URL command started');

    validateUrl(url);
    validateOutputFormat(options.output);

    const searchEngine = createSearchEngine();

    const result = await withSpinner(
      'Extracting URL content...',
      async () => searchEngine.extractUrl({
        url,
        depth: options.depth,
        includeLinks: options.includeLinks,
      }),
      'Extraction completed',
      'Extraction failed',
    );

    await searchEngine.cleanup();

    if (options.output === 'json') {
      console.log(formatOutput(result, 'json'));
    } else {
      // Text format (default)
      if (result.title) {
        console.log(formatHeader(result.title));
        console.log('');
      }
      
      if (result.author) {
        console.log(`Author: ${result.author}`);
      }
      
      if (result.publishDate) {
        console.log(`Published: ${result.publishDate}`);
      }
      
      if (result.author || result.publishDate) {
        console.log('');
      }
      
      console.log(formatHeader('Content'));
      console.log('');
      console.log(result.content);
      
      if (result.links && result.links.length > 0) {
        console.log('');
        console.log(formatHeader('Links'));
        result.links.forEach((link, i) => {
          console.log(`${i + 1}. ${link}`);
        });
      }
      
      if (result.images && result.images.length > 0) {
        console.log('');
        console.log(formatHeader('Images'));
        result.images.forEach((image, i) => {
          console.log(`${i + 1}. ${image}`);
        });
      }
    }

    logger.info('Extract URL command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Extract URL command failed');
    console.log(formatError(`URL extraction failed: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}
