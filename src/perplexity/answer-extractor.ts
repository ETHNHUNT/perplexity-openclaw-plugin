/**
 * Answer extraction from various response formats
 */

import type { Page } from 'puppeteer';
import type { Source } from '../types/perplexity.js';
import { logger } from '../utils/logger.js';
import { SELECTORS } from './constants.js';
import { extractTextWithFallback } from './selector-detector.js';

/**
 * Extracts answer text from the page
 */
export async function extractAnswer(page: Page): Promise<string> {
  const answerSelectors = [
    SELECTORS.ANSWER_CONTAINER,
    '[data-testid="answer"]',
    '.answer-container',
    'main article',
    '[role="article"]',
    'main > div:first-child',
  ];

  const answer = await extractTextWithFallback(page, answerSelectors);

  if (!answer) {
    logger.warn('Could not extract answer from page');
    return '';
  }

  logger.info({ length: answer.length }, 'Answer extracted');
  return answer;
}

/**
 * Extracts sources from the page
 */
export async function extractSources(page: Page): Promise<Source[]> {
  try {
    const sources = await page.$$eval(
      `${SELECTORS.SOURCE_LINKS}, a[data-source], .source-link, [data-testid="source"]`,
      (elements) =>
        elements.map((el, index) => ({
          title: el.textContent?.trim() ?? '',
          url: el.getAttribute('href') ?? '',
          index: index + 1,
        })),
    );

    logger.info({ count: sources.length }, 'Sources extracted');
    return sources.filter((s) => s.url && s.title);
  } catch (error) {
    logger.warn({ error }, 'Could not extract sources');
    return [];
  }
}

/**
 * Extracts related questions from the page
 */
export async function extractRelatedQuestions(page: Page): Promise<string[]> {
  try {
    const questions = await page.$$eval(
      `${SELECTORS.RELATED_QUESTIONS}, [data-testid="related"], .related-question, .related`,
      (elements) => elements.map((el) => el.textContent?.trim() ?? '').filter(Boolean),
    );

    logger.info({ count: questions.length }, 'Related questions extracted');
    return questions;
  } catch (error) {
    logger.warn({ error }, 'Could not extract related questions');
    return [];
  }
}

/**
 * Extracts images from the page
 */
export async function extractImages(page: Page): Promise<Array<{ url: string; alt?: string }>> {
  try {
    const images = await page.$$eval('img[src*="http"]', (elements) =>
      elements
        .map((img) => ({
          url: img.getAttribute('src') ?? '',
          alt: img.getAttribute('alt') ?? undefined,
        }))
        .filter((img) => img.url && !img.url.includes('icon') && !img.url.includes('logo')),
    );

    logger.debug({ count: images.length }, 'Images extracted');
    return images.slice(0, 10); // Limit to 10 images
  } catch (error) {
    logger.warn({ error }, 'Could not extract images');
    return [];
  }
}

/**
 * Extracts conversation ID from the page
 */
export async function extractConversationId(page: Page): Promise<string | undefined> {
  try {
    // Try to get from URL
    const url = page.url();
    const match = url.match(/\/conversation\/([a-zA-Z0-9-]+)/);
    if (match) {
      const conversationId = match[1];
      logger.debug({ conversationId }, 'Conversation ID extracted from URL');
      return conversationId;
    }

    // Try to get from page data
    const conversationId = await page.evaluate(() => {
      const metaTag = (globalThis as any).document?.querySelector('meta[name="conversation-id"]');
      return metaTag?.getAttribute('content') ?? undefined;
    });

    if (conversationId) {
      logger.debug({ conversationId }, 'Conversation ID extracted from meta tag');
    }

    return conversationId;
  } catch (error) {
    logger.warn({ error }, 'Could not extract conversation ID');
    return undefined;
  }
}

/**
 * Extracts complete search result from the page
 */
export async function extractSearchResult(page: Page) {
  const [answer, sources, relatedQuestions, conversationId] = await Promise.all([
    extractAnswer(page),
    extractSources(page),
    extractRelatedQuestions(page),
    extractConversationId(page),
  ]);

  return {
    answer,
    sources,
    relatedQuestions,
    conversationId,
    timestamp: Date.now(),
  };
}

/**
 * Waits for answer to be fully loaded
 */
export async function waitForAnswerComplete(page: Page, timeout = 30000): Promise<void> {
  const startTime = Date.now();
  let previousLength = 0;
  let stableCount = 0;

  while (Date.now() - startTime < timeout) {
    try {
      // Check if loading spinner is gone
      const hasSpinner = await page.$(SELECTORS.LOADING_SPINNER);
      if (!hasSpinner) {
        // Check if answer length is stable
        const answer = await extractAnswer(page);
        if (answer.length === previousLength) {
          stableCount++;
          if (stableCount >= 3) {
            logger.debug('Answer complete');
            return;
          }
        } else {
          stableCount = 0;
          previousLength = answer.length;
        }
      }

      await page.waitForTimeout(1000);
    } catch (error) {
      logger.warn({ error }, 'Error waiting for answer');
      break;
    }
  }

  logger.warn('Answer load timeout');
}
