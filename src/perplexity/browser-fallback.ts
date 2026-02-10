/**
 * Browser fallback for when API calls fail
 */

import type { Browser, Page } from 'puppeteer';
import type {
  SearchOptions,
  SearchResult,
  ChatOptions,
  ChatResult,
  ExtractUrlOptions,
  ExtractUrlResult,
} from '../types/perplexity.js';
import {
  launchBrowser,
  createPage,
  navigateToUrl,
  typeIntoInput,
  clickElement,
  closeBrowser,
} from '../utils/puppeteer-utils.js';
import { formatCookiesForHttp } from '../auth/cookie-manager.js';
import { getCurrentSession } from '../auth/session-manager.js';
import { logger } from '../utils/logger.js';
import { BrowserError, AuthenticationError } from '../utils/error-handler.js';
import { extractSearchResult, waitForAnswerComplete } from './answer-extractor.js';
import { findSelector } from './selector-detector.js';
import { PERPLEXITY_URLS, SELECTORS, TIMEOUTS } from './constants.js';

export class BrowserFallback {
  private browser: Browser | null = null;

  /**
   * Performs a search using browser automation
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ query: options.query }, 'Performing search via browser');

      this.browser = await launchBrowser();
      const page = await createPage(this.browser);

      // Set cookies
      await page.setCookie(...session.cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expires ? cookie.expires / 1000 : undefined,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      })));

      // Navigate to Perplexity
      await navigateToUrl(page, PERPLEXITY_URLS.BASE);

      // Find and type into search input
      const searchInputSelector = await findSelector(page, 'searchInput');
      if (!searchInputSelector) {
        throw new BrowserError('Could not find search input');
      }

      await typeIntoInput(page, searchInputSelector, options.query);

      // Submit search
      await page.keyboard.press('Enter');

      // Wait for answer to load
      await waitForAnswerComplete(page, TIMEOUTS.SEARCH);

      // Extract result
      const result = await extractSearchResult(page);

      await closeBrowser(this.browser);
      this.browser = null;

      logger.info({ query: options.query }, 'Browser search completed');
      return result;
    } catch (error) {
      if (this.browser) {
        await closeBrowser(this.browser);
        this.browser = null;
      }
      throw new BrowserError(
        `Browser search failed: ${error instanceof Error ? error.message : String(error)}`,
        error,
      );
    }
  }

  /**
   * Performs a chat interaction using browser automation
   */
  async chat(options: ChatOptions): Promise<ChatResult> {
    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ message: options.message.substring(0, 50) }, 'Performing chat via browser');

      this.browser = await launchBrowser();
      const page = await createPage(this.browser);

      // Set cookies
      await page.setCookie(...session.cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expires ? cookie.expires / 1000 : undefined,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      })));

      // Navigate to conversation or base
      const url = options.conversationId
        ? `${PERPLEXITY_URLS.BASE}/conversation/${options.conversationId}`
        : PERPLEXITY_URLS.BASE;
      
      await navigateToUrl(page, url);

      // Find chat input
      const chatInputSelector = await findSelector(page, 'searchInput');
      if (!chatInputSelector) {
        throw new BrowserError('Could not find chat input');
      }

      await typeIntoInput(page, chatInputSelector, options.message);
      await page.keyboard.press('Enter');

      // Wait for response
      await waitForAnswerComplete(page, TIMEOUTS.CHAT);

      // Extract result
      const searchResult = await extractSearchResult(page);

      const result: ChatResult = {
        response: searchResult.answer,
        conversationId: searchResult.conversationId ?? '',
        sources: searchResult.sources,
        timestamp: Date.now(),
      };

      await closeBrowser(this.browser);
      this.browser = null;

      logger.info('Browser chat completed');
      return result;
    } catch (error) {
      if (this.browser) {
        await closeBrowser(this.browser);
        this.browser = null;
      }
      throw new BrowserError(
        `Browser chat failed: ${error instanceof Error ? error.message : String(error)}`,
        error,
      );
    }
  }

  /**
   * Extracts URL content using browser automation
   */
  async extractUrl(options: ExtractUrlOptions): Promise<ExtractUrlResult> {
    const session = getCurrentSession();
    if (!session) {
      throw new AuthenticationError('Not authenticated');
    }

    try {
      logger.info({ url: options.url }, 'Extracting URL via browser');

      this.browser = await launchBrowser();
      const page = await createPage(this.browser);

      // Set cookies
      await page.setCookie(...session.cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expires ? cookie.expires / 1000 : undefined,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      })));

      // Navigate to Perplexity and submit URL
      await navigateToUrl(page, PERPLEXITY_URLS.BASE);

      const searchInputSelector = await findSelector(page, 'searchInput');
      if (!searchInputSelector) {
        throw new BrowserError('Could not find search input');
      }

      // Submit URL for extraction
      await typeIntoInput(page, searchInputSelector, `Extract content from: ${options.url}`);
      await page.keyboard.press('Enter');

      // Wait for extraction
      await waitForAnswerComplete(page, TIMEOUTS.EXTRACT);

      // Extract result
      const searchResult = await extractSearchResult(page);

      const result: ExtractUrlResult = {
        content: searchResult.answer,
        timestamp: Date.now(),
      };

      await closeBrowser(this.browser);
      this.browser = null;

      logger.info({ url: options.url }, 'Browser URL extraction completed');
      return result;
    } catch (error) {
      if (this.browser) {
        await closeBrowser(this.browser);
        this.browser = null;
      }
      throw new BrowserError(
        `Browser URL extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        error,
      );
    }
  }

  /**
   * Cleans up browser resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await closeBrowser(this.browser);
      this.browser = null;
    }
  }
}

/**
 * Creates a new browser fallback instance
 */
export function createBrowserFallback(): BrowserFallback {
  return new BrowserFallback();
}
