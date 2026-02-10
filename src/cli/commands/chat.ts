#!/usr/bin/env node
/**
 * Chat command - Interactive chat/conversation
 */

import { createSearchEngine } from '../../perplexity/search-engine.js';
import type { ChatCommandOptions } from '../../types/cli.js';
import { logger } from '../../utils/logger.js';
import { validateOutputFormat } from '../../utils/validators.js';
import { formatError, formatHeader, formatOutput } from '../utils/formatter.js';
import { withSpinner } from '../utils/spinner.js';

/**
 * Main chat command handler
 */
export async function chatCommand(message: string, options: ChatCommandOptions): Promise<void> {
  try {
    logger.info({ message: message.substring(0, 50), options }, 'Chat command started');

    validateOutputFormat(options.output);

    const searchEngine = createSearchEngine();

    const result = await withSpinner(
      'Sending message...',
      async () =>
        searchEngine.chat({
          message,
          conversationId: options.conversationId,
          model: options.model as any,
          modelCouncil: options.modelCouncil,
        }),
      'Message sent',
      'Chat failed',
    );

    await searchEngine.cleanup();

    if (options.output === 'json') {
      console.log(formatOutput(result, 'json'));
    } else {
      // Text format (default)
      console.log(formatHeader('Response'));
      console.log('');
      console.log(result.response);

      if (result.conversationId) {
        console.log('');
        console.log(`Conversation ID: ${result.conversationId}`);
      }

      if (result.sources && result.sources.length > 0) {
        console.log('');
        console.log(formatHeader('Sources'));
        result.sources.forEach((source, i) => {
          console.log(`${i + 1}. ${source.title}`);
          console.log(`   ${source.url}`);
        });
      }
    }

    logger.info('Chat command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Chat command failed');
    console.log(
      formatError(`Chat failed: ${error instanceof Error ? error.message : String(error)}`),
    );
    process.exit(1);
  }
}
