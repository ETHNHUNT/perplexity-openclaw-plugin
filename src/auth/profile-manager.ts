/**
 * Profile manager for reusing existing browser profiles
 */

import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Cookie } from '../types/common.js';
import type { AuthCredentials } from './types.js';
import { logger } from '../utils/logger.js';
import { AuthenticationError } from '../utils/error-handler.js';
import { validatePath } from '../utils/validators.js';

/**
 * Loads profile from an existing browser profile directory
 */
export async function loadProfileFromPath(profilePath: string): Promise<AuthCredentials> {
  try {
    validatePath(profilePath, 'Profile path');

    if (!existsSync(profilePath)) {
      throw new AuthenticationError(`Profile path does not exist: ${profilePath}`);
    }

    logger.info({ profilePath }, 'Loading profile');

    // Look for cookie files in the profile directory
    const cookies = await extractCookiesFromProfile(profilePath);

    if (cookies.length === 0) {
      throw new AuthenticationError('No cookies found in profile');
    }

    return {
      cookies,
      expiresAt: Date.now() + 86400000, // 24 hours
    };
  } catch (error) {
    throw new AuthenticationError(
      `Failed to load profile: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Extracts cookies from a browser profile directory
 */
async function extractCookiesFromProfile(profilePath: string): Promise<Cookie[]> {
  const cookies: Cookie[] = [];

  // Common cookie file names in browser profiles
  const cookieFiles = [
    'Cookies',
    'cookies.json',
    '.cookies',
    'cookies.sqlite',
  ];

  for (const cookieFile of cookieFiles) {
    const cookiePath = join(profilePath, cookieFile);
    
    if (existsSync(cookiePath)) {
      try {
        const extracted = await parseCookieFile(cookiePath);
        cookies.push(...extracted);
        logger.debug({ file: cookieFile, count: extracted.length }, 'Cookies extracted from file');
      } catch (error) {
        logger.warn({ file: cookieFile, error }, 'Failed to parse cookie file');
      }
    }
  }

  return cookies;
}

/**
 * Parses a cookie file (supports JSON format)
 */
async function parseCookieFile(filePath: string): Promise<Cookie[]> {
  try {
    // Try JSON format first
    if (filePath.endsWith('.json')) {
      const { readFileSync } = await import('node:fs');
      const content = readFileSync(filePath, 'utf8');
      return JSON.parse(content) as Cookie[];
    }

    // For other formats, we'd need specialized parsers
    // This is a simplified implementation
    logger.warn({ filePath }, 'Unsupported cookie file format');
    return [];
  } catch (error) {
    logger.error({ filePath, error }, 'Failed to parse cookie file');
    return [];
  }
}

/**
 * Validates a profile directory
 */
export function validateProfileDirectory(profilePath: string): boolean {
  try {
    if (!existsSync(profilePath)) {
      return false;
    }

    const stat = statSync(profilePath);
    if (!stat.isDirectory()) {
      return false;
    }

    // Check if it looks like a browser profile
    const files = readdirSync(profilePath);
    const hasProfileFiles = files.some((file) =>
      ['Cookies', 'cookies.json', 'Preferences', 'Local State'].includes(file),
    );

    return hasProfileFiles;
  } catch {
    return false;
  }
}

/**
 * Finds common profile locations
 */
export function findCommonProfilePaths(): string[] {
  const { homedir } = require('node:os');
  const home = homedir();

  return [
    join(home, '.perplexity-mcp'),
    join(home, '.config', 'perplexity'),
    join(home, '.perplexity'),
    join(home, 'Library', 'Application Support', 'perplexity'),
    join(home, 'AppData', 'Roaming', 'perplexity'),
  ].filter(existsSync);
}
