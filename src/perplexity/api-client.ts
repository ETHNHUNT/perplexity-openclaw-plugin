/**
 * Perplexity API client for direct HTTP calls
 */

import { formatCookiesForHttp } from '../auth/cookie-manager.js';
import { getCurrentSession } from '../auth/session-manager.js';
import type {
  ChatOptions,
  ChatResult,
  ExtractUrlOptions,
  ExtractUrlResult,
  ResearchOptions,
  ResearchResult,
  SearchOptions,
  SearchResult,
  Source,
} from '../types/perplexity.js';
import { AuthenticationError, NetworkError } from '../utils/error-handler.js';
import { type HttpClient, createHttpClient } from '../utils/http-client.js';
import { logger } from '../utils/logger.js';
import { validateNotEmpty, validateUrl } from '../utils/validators.js';
import { API_ENDPOINTS, PERPLEXITY_URLS } from './constants.js';

export class PerplexityApiClient {
  private client: HttpClient;

  constructor() {
    this.client = createHttpClient(PERPLEXITY_URLS.API);
  }

  /**
   * Performs a search query
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    validateNotEmpty(options.query, 'Search query');

    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ query: options.query }, 'Performing search');

      this.client.setCookies(formatCookiesForHttp(session.cookies));

      const response = await this.client.post<{
        answer: string;
        sources: Source[];
        related: string[];
        conversationId?: string;
      }>(API_ENDPOINTS.SEARCH, {
        query: options.query,
        mode: options.mode ?? 'concise',
        focus: options.focus ?? 'internet',
        pro: options.proSearch ?? false,
      });

      return {
        answer: response.answer,
        sources: response.sources ?? [],
        relatedQuestions: response.related ?? [],
        conversationId: response.conversationId,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error({ error }, 'Search API call failed');
      throw new NetworkError('Search failed', error);
    }
  }

  /**
   * Performs deep research
   */
  async research(options: ResearchOptions): Promise<ResearchResult> {
    validateNotEmpty(options.topic, 'Research topic');

    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ topic: options.topic, deep: options.deep }, 'Performing research');

      this.client.setCookies(formatCookiesForHttp(session.cookies));

      const response = await this.client.post<{
        summary: string;
        sections: Array<{ title: string; content: string; sources: number[] }>;
        sources: Source[];
        related: string[];
        conversationId?: string;
      }>(API_ENDPOINTS.RESEARCH, {
        topic: options.topic,
        deep: options.deep ?? false,
        maxDepth: options.maxDepth ?? 3,
      });

      return {
        summary: response.summary,
        sections: response.sections ?? [],
        sources: response.sources ?? [],
        relatedTopics: response.related ?? [],
        conversationId: response.conversationId,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error({ error }, 'Research API call failed');
      throw new NetworkError('Research failed', error);
    }
  }

  /**
   * Sends a chat message
   */
  async chat(options: ChatOptions): Promise<ChatResult> {
    validateNotEmpty(options.message, 'Chat message');

    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ message: options.message.substring(0, 50) }, 'Sending chat message');

      this.client.setCookies(formatCookiesForHttp(session.cookies));

      const response = await this.client.post<{
        response: string;
        conversationId: string;
        sources?: Source[];
      }>(API_ENDPOINTS.CHAT, {
        message: options.message,
        conversationId: options.conversationId,
        model: options.model ?? 'default',
        modelCouncil: options.modelCouncil ?? false,
      });

      return {
        response: response.response,
        conversationId: response.conversationId,
        sources: response.sources,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error({ error }, 'Chat API call failed');
      throw new NetworkError('Chat failed', error);
    }
  }

  /**
   * Extracts content from a URL
   */
  async extractUrl(options: ExtractUrlOptions): Promise<ExtractUrlResult> {
    validateUrl(options.url);

    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ url: options.url }, 'Extracting URL content');

      this.client.setCookies(formatCookiesForHttp(session.cookies));

      const response = await this.client.post<{
        content: string;
        title?: string;
        author?: string;
        publishDate?: string;
        links?: string[];
        images?: string[];
      }>(API_ENDPOINTS.EXTRACT, {
        url: options.url,
        depth: options.depth ?? 1,
        includeLinks: options.includeLinks ?? false,
      });

      return {
        content: response.content,
        title: response.title,
        author: response.author,
        publishDate: response.publishDate,
        links: response.links,
        images: response.images,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error({ error }, 'URL extraction API call failed');
      throw new NetworkError('URL extraction failed', error);
    }
  }
}

/**
 * Creates a new Perplexity API client instance
 */
export function createPerplexityApiClient(): PerplexityApiClient {
  return new PerplexityApiClient();
}
