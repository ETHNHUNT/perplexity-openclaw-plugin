/**
 * Manual cookie management
 */

import { readFileSync } from 'node:fs';
import type { Cookie } from '../types/common.js';
import type { AuthCredentials } from './types.js';
import { logger } from '../utils/logger.js';
import { AuthenticationError, ValidationError } from '../utils/error-handler.js';
import { validatePath } from '../utils/validators.js';

/**
 * Loads cookies from a JSON file
 */
export function loadCookiesFromFile(filePath: string): Cookie[] {
  try {
    validatePath(filePath, 'Cookie file path');

    logger.debug({ filePath }, 'Loading cookies from file');
    const content = readFileSync(filePath, 'utf8');
    const cookies = JSON.parse(content) as Cookie[];

    if (!Array.isArray(cookies)) {
      throw new ValidationError('Cookie file must contain an array of cookies');
    }

    // Validate and normalize cookie structure
    for (const cookie of cookies) {
      if (!cookie.name || !cookie.value || !cookie.domain) {
        throw new ValidationError('Invalid cookie format: missing required fields');
      }
      
      // Normalize expires to milliseconds if it appears to be in seconds
      if (cookie.expires && cookie.expires < 1e12) {
        cookie.expires = cookie.expires * 1000;
      }
    }

    logger.info({ count: cookies.length }, 'Cookies loaded from file');
    return cookies;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new AuthenticationError(
      `Failed to load cookies from file: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Converts cookies to a credential object
 */
export function cookiesToCredentials(cookies: Cookie[]): AuthCredentials {
  const expiresAt = Date.now() + 86400000; // 24 hours from now

  return {
    cookies,
    expiresAt,
  };
}

/**
 * Formats cookies for HTTP requests
 */
export function formatCookiesForHttp(cookies: Cookie[]): string {
  return cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

/**
 * Filters cookies by domain
 */
export function filterCookiesByDomain(cookies: Cookie[], domain: string): Cookie[] {
  return cookies.filter(
    (cookie) => 
      cookie.domain === domain || 
      cookie.domain === `.${domain}` ||
      domain.endsWith(cookie.domain.replace(/^\./, '')),
  );
}

/**
 * Checks if cookies are expired
 */
export function areCookiesExpired(cookies: Cookie[]): boolean {
  const now = Date.now();
  
  return cookies.some((cookie) => {
    if (!cookie.expires) return false;
    return cookie.expires < now;
  });
}

/**
 * Validates cookies for Perplexity
 */
export function validatePerplexityCookies(cookies: Cookie[]): boolean {
  const perplexityCookies = filterCookiesByDomain(cookies, 'perplexity.ai');
  
  if (perplexityCookies.length === 0) {
    logger.warn('No Perplexity cookies found');
    return false;
  }

  if (areCookiesExpired(perplexityCookies)) {
    logger.warn('Perplexity cookies are expired');
    return false;
  }

  logger.info({ count: perplexityCookies.length }, 'Perplexity cookies validated');
  return true;
}
