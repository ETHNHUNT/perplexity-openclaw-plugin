/**
 * Puppeteer browser automation utilities
 */

import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import { BrowserError } from './error-handler.js';
import { logger } from './logger.js';
import { config } from './config.js';

/**
 * Launches a browser instance
 */
export async function launchBrowser(): Promise<Browser> {
  try {
    logger.debug({ headless: config.headlessBrowser }, 'Launching browser');
    
    const browser = await puppeteer.launch({
      headless: config.headlessBrowser,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    logger.info('Browser launched successfully');
    return browser;
  } catch (error) {
    throw new BrowserError(
      `Failed to launch browser: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Creates a new page with default settings
 */
export async function createPage(browser: Browser): Promise<Page> {
  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );

    logger.debug('New page created');
    return page;
  } catch (error) {
    throw new BrowserError(
      `Failed to create page: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Navigates to a URL with timeout
 */
export async function navigateToUrl(page: Page, url: string): Promise<void> {
  try {
    logger.debug({ url }, 'Navigating to URL');
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: config.navigationTimeout,
    });

    logger.debug({ url }, 'Navigation completed');
  } catch (error) {
    throw new BrowserError(
      `Failed to navigate to ${url}: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Waits for a selector to appear
 */
export async function waitForSelector(
  page: Page,
  selector: string,
  timeout?: number,
): Promise<void> {
  try {
    await page.waitForSelector(selector, {
      timeout: timeout ?? config.browserTimeout,
    });
    logger.debug({ selector }, 'Selector found');
  } catch (error) {
    throw new BrowserError(
      `Selector not found: ${selector}`,
      error,
    );
  }
}

/**
 * Types text into an input field
 */
export async function typeIntoInput(
  page: Page,
  selector: string,
  text: string,
): Promise<void> {
  try {
    await waitForSelector(page, selector);
    await page.type(selector, text, { delay: 50 });
    logger.debug({ selector }, 'Text typed into input');
  } catch (error) {
    throw new BrowserError(
      `Failed to type into ${selector}: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Clicks an element
 */
export async function clickElement(page: Page, selector: string): Promise<void> {
  try {
    await waitForSelector(page, selector);
    await page.click(selector);
    logger.debug({ selector }, 'Element clicked');
  } catch (error) {
    throw new BrowserError(
      `Failed to click ${selector}: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Extracts text from an element
 */
export async function extractText(page: Page, selector: string): Promise<string> {
  try {
    await waitForSelector(page, selector);
    const text = await page.$eval(selector, (el) => el.textContent ?? '');
    logger.debug({ selector, length: text.length }, 'Text extracted');
    return text.trim();
  } catch (error) {
    throw new BrowserError(
      `Failed to extract text from ${selector}: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Safely closes the browser
 */
export async function closeBrowser(browser: Browser): Promise<void> {
  try {
    await browser.close();
    logger.debug('Browser closed');
  } catch (error) {
    logger.warn({ error }, 'Error closing browser');
  }
}
