/**
 * Search engine abstraction with API and browser fallback
 */

import type {
  SearchOptions,
  SearchResult,
  ResearchOptions,
  ResearchResult,
  ChatOptions,
  ChatResult,
  ExtractUrlOptions,
  ExtractUrlResult,
} from '../types/perplexity.js';
import { createPerplexityApiClient } from './api-client.js';
import { createBrowserFallback } from './browser-fallback.js';
import { logger } from '../utils/logger.js';

export class SearchEngine {
  private apiClient = createPerplexityApiClient();
  private browserFallback = createBrowserFallback();

  /**
   * Performs a search with automatic fallback
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    try {
      logger.debug('Attempting API search');
      return await this.apiClient.search(options);
    } catch (error) {
      logger.warn({ error }, 'API search failed, falling back to browser');
      try {
        return await this.browserFallback.search(options);
      } finally {
        await this.browserFallback.cleanup();
      }
    }
  }

  /**
   * Performs research with automatic fallback
   */
  async research(options: ResearchOptions): Promise<ResearchResult> {
    try {
      logger.debug('Attempting API research');
      return await this.apiClient.research(options);
    } catch (error) {
      logger.warn({ error }, 'API research failed, using search fallback');
      // Research via browser can use search functionality
      try {
        const searchResult = await this.browserFallback.search({
          query: options.topic,
          mode: 'detailed',
          proSearch: options.deep,
        });

        // Convert search result to research result
        return {
          summary: searchResult.answer,
          sections: [
            {
              title: 'Main Content',
              content: searchResult.answer,
              sources: searchResult.sources.map((_, index) => index),
            },
          ],
          sources: searchResult.sources,
          relatedTopics: searchResult.relatedQuestions,
          conversationId: searchResult.conversationId,
          timestamp: Date.now(),
        };
      } finally {
        await this.browserFallback.cleanup();
      }
    }
  }

  /**
   * Performs chat with automatic fallback
   */
  async chat(options: ChatOptions): Promise<ChatResult> {
    try {
      logger.debug('Attempting API chat');
      return await this.apiClient.chat(options);
    } catch (error) {
      logger.warn({ error }, 'API chat failed, falling back to browser');
      try {
        return await this.browserFallback.chat(options);
      } finally {
        await this.browserFallback.cleanup();
      }
    }
  }

  /**
   * Extracts URL content with automatic fallback
   */
  async extractUrl(options: ExtractUrlOptions): Promise<ExtractUrlResult> {
    try {
      logger.debug('Attempting API URL extraction');
      return await this.apiClient.extractUrl(options);
    } catch (error) {
      logger.warn({ error }, 'API URL extraction failed, falling back to browser');
      try {
        return await this.browserFallback.extractUrl(options);
      } finally {
        await this.browserFallback.cleanup();
      }
    }
  }

  /**
   * Cleans up resources
   */
  async cleanup(): Promise<void> {
    await this.browserFallback.cleanup();
  }
}

/**
 * Creates a new search engine instance
 */
export function createSearchEngine(): SearchEngine {
  return new SearchEngine();
}
