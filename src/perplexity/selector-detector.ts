/**
 * Dynamic selector detection for UI changes
 */

import type { Page } from 'puppeteer';
import { logger } from '../utils/logger.js';
import { SELECTORS } from './constants.js';

interface SelectorVariant {
  primary: string;
  alternatives: string[];
}

const SELECTOR_VARIANTS: Record<string, SelectorVariant> = {
  searchInput: {
    primary: SELECTORS.SEARCH_INPUT,
    alternatives: [
      'textarea[placeholder*="ask"]',
      'textarea[placeholder*="search"]',
      'input[data-testid="search"]',
      '#search-input',
      '[role="searchbox"]',
    ],
  },
  answerContainer: {
    primary: SELECTORS.ANSWER_CONTAINER,
    alternatives: [
      '[data-testid="answer"]',
      '.answer',
      'main > article',
      '[role="article"]',
      '.response-container',
    ],
  },
  sourceLinks: {
    primary: SELECTORS.SOURCE_LINKS,
    alternatives: ['a[data-source]', '.source-link', '[data-testid="source"]', 'a[href*="source"]'],
  },
};

/**
 * Attempts to find a selector using variants
 */
export async function findSelector(
  page: Page,
  selectorName: keyof typeof SELECTOR_VARIANTS,
  timeout = 5000,
): Promise<string | null> {
  const variants = SELECTOR_VARIANTS[selectorName];
  if (!variants) {
    logger.warn({ selectorName }, 'Unknown selector name');
    return null;
  }

  // Try primary selector first
  try {
    await page.waitForSelector(variants.primary, { timeout });
    logger.debug({ selector: variants.primary }, 'Primary selector found');
    return variants.primary;
  } catch {
    logger.debug({ selector: variants.primary }, 'Primary selector not found');
  }

  // Try alternatives
  for (const alternative of variants.alternatives) {
    try {
      await page.waitForSelector(alternative, { timeout: timeout / variants.alternatives.length });
      logger.info({ selector: alternative }, 'Alternative selector found');
      return alternative;
    } catch {
      // Continue to next alternative
    }
  }

  logger.warn({ selectorName }, 'No selector variant found');
  return null;
}

/**
 * Detects current page structure
 */
export async function detectPageStructure(page: Page): Promise<{
  hasSearchInput: boolean;
  hasAnswerContainer: boolean;
  hasProBadge: boolean;
}> {
  const searchInput = await findSelector(page, 'searchInput', 2000);
  const answerContainer = await findSelector(page, 'answerContainer', 2000);

  let hasProBadge = false;
  try {
    await page.waitForSelector(SELECTORS.PRO_BADGE, { timeout: 1000 });
    hasProBadge = true;
  } catch {
    // No pro badge
  }

  return {
    hasSearchInput: searchInput !== null,
    hasAnswerContainer: answerContainer !== null,
    hasProBadge,
  };
}

/**
 * Waits for content to load by detecting changes
 */
export async function waitForContentLoad(
  page: Page,
  previousContent: string,
  timeout = 10000,
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const currentContent = await page.content();
      if (currentContent !== previousContent && currentContent.length > previousContent.length) {
        logger.debug('Content changed, load complete');
        return true;
      }
      await page.waitForTimeout(500);
    } catch (error) {
      logger.warn({ error }, 'Error checking content load');
      return false;
    }
  }

  logger.warn('Content load timeout');
  return false;
}

/**
 * Extracts text with fallback selectors
 */
export async function extractTextWithFallback(
  page: Page,
  selectors: string[],
): Promise<string | null> {
  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        const text = await page.evaluate((el) => el?.textContent ?? '', element);
        if (text.trim()) {
          logger.debug({ selector, length: text.length }, 'Text extracted');
          return text.trim();
        }
      }
    } catch {
      // Try next selector
    }
  }

  logger.warn('No text found with any selector');
  return null;
}
