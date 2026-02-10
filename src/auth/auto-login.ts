/**
 * Automated login with Puppeteer
 */

import type { Browser, Page } from 'puppeteer';
import type { Cookie } from '../types/common.js';
import { config } from '../utils/config.js';
import { AuthenticationError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';
import {
  clickElement,
  closeBrowser,
  createPage,
  launchBrowser,
  navigateToUrl,
  typeIntoInput,
} from '../utils/puppeteer-utils.js';
import { validateEmail, validateNotEmpty } from '../utils/validators.js';
import type { LoginResult } from './types.js';

/**
 * Performs automated login to Perplexity
 */
export async function performAutoLogin(email: string, password: string): Promise<LoginResult> {
  validateEmail(email);
  validateNotEmpty(password, 'Password');

  let browser: Browser | null = null;

  try {
    logger.info({ email }, 'Starting automated login');

    browser = await launchBrowser();
    const page = await createPage(browser);

    // Navigate to Perplexity login page
    await navigateToUrl(page, `${config.perplexityBaseUrl}/`);

    // Wait for login button and click it
    await page.waitForSelector('button, a', { timeout: 10000 });

    // Look for sign-in or login button
    const loginButtonSelectors = [
      '[data-testid="login-button"]',
      '[aria-label="Sign in"]',
      '[aria-label="Log in"]',
      'button[type="button"]',
    ];

    let loginClicked = false;
    for (const selector of loginButtonSelectors) {
      try {
        await clickElement(page, selector);
        loginClicked = true;
        break;
      } catch {
        // Try next selector
      }
    }

    if (!loginClicked) {
      logger.warn('Could not find login button, assuming already on login page');
    }

    // Wait for email input
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });

    // Type email
    await typeIntoInput(page, 'input[type="email"], input[name="email"]', email);

    // Type password
    await typeIntoInput(page, 'input[type="password"], input[name="password"]', password);

    // Click submit button
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Continue")',
      'button:has-text("Sign in")',
      'button:has-text("Log in")',
    ];

    let submitClicked = false;
    for (const selector of submitSelectors) {
      try {
        await clickElement(page, selector);
        submitClicked = true;
        break;
      } catch {
        // Try next selector
      }
    }

    if (!submitClicked) {
      throw new AuthenticationError('Could not find submit button');
    }

    // Wait for navigation or error
    await page.waitForNavigation({ timeout: 30000, waitUntil: 'networkidle2' }).catch(() => {
      // Navigation might not happen if there's an error
    });

    // Check for errors
    const errorSelectors = ['[role="alert"]', '.error', '[data-testid="error-message"]'];

    for (const selector of errorSelectors) {
      const errorElement = await page.$(selector);
      if (errorElement) {
        const errorText = await page.evaluate((el) => el?.textContent ?? '', errorElement);
        throw new AuthenticationError(`Login failed: ${errorText}`);
      }
    }

    // Wait a bit for session to establish
    await page.waitForTimeout(3000);

    // Extract cookies
    const cookies = await extractCookiesFromPage(page);

    await closeBrowser(browser);

    logger.info({ email, cookieCount: cookies.length }, 'Auto login successful');

    return {
      success: true,
      session: {
        cookies,
        expiresAt: Date.now() + config.sessionTimeout,
        createdAt: Date.now(),
        isValid: true,
      },
    };
  } catch (error) {
    if (browser) {
      await closeBrowser(browser);
    }

    const message = error instanceof Error ? error.message : String(error);
    logger.error({ email, error }, 'Auto login failed');

    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Extracts cookies from a Puppeteer page
 */
async function extractCookiesFromPage(page: Page): Promise<Cookie[]> {
  const puppeteerCookies = await page.cookies();

  return puppeteerCookies.map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.expires ? cookie.expires * 1000 : undefined,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite as Cookie['sameSite'],
  }));
}

/**
 * Detects if CAPTCHA or 2FA is required
 */
export async function detectCaptchaOr2FA(page: Page): Promise<boolean> {
  const captchaSelectors = [
    'iframe[src*="recaptcha"]',
    'iframe[src*="hcaptcha"]',
    '[data-testid="captcha"]',
    '#captcha',
  ];

  const twoFASelectors = [
    'input[name="code"]',
    'input[name="otp"]',
    '[data-testid="2fa-input"]',
    'input[autocomplete="one-time-code"]',
  ];

  for (const selector of [...captchaSelectors, ...twoFASelectors]) {
    const element = await page.$(selector);
    if (element) {
      return true;
    }
  }

  return false;
}
