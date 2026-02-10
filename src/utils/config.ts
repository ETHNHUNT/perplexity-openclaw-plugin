/**
 * Configuration management
 */

import { homedir } from 'node:os';
import { join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import type { Config } from '../types/common.js';

// Load environment variables
dotenvConfig();

const env = process.env;

function getEnvNumber(key: string, defaultValue: number): number {
  const value = env[key];
  if (value === undefined) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getEnvString(key: string, defaultValue: string): string {
  return env[key] ?? defaultValue;
}

/**
 * Application configuration with environment variable overrides
 */
export const config: Config = {
  // Perplexity URLs
  perplexityBaseUrl: getEnvString('PERPLEXITY_BASE_URL', 'https://www.perplexity.ai'),
  perplexityApiUrl: getEnvString('PERPLEXITY_API_URL', 'https://www.perplexity.ai/api'),

  // Authentication
  authStoragePath: getEnvString(
    'AUTH_STORAGE_PATH',
    join(homedir(), '.perplexity', 'credentials.json'),
  ),
  sessionTimeout: getEnvNumber('SESSION_TIMEOUT', 86400000), // 24 hours
  encryptionEnabled: getEnvBoolean('ENCRYPTION_ENABLED', true),

  // Browser Automation
  headlessBrowser: getEnvBoolean('HEADLESS_BROWSER', true),
  browserTimeout: getEnvNumber('BROWSER_TIMEOUT', 30000),
  navigationTimeout: getEnvNumber('NAVIGATION_TIMEOUT', 30000),

  // Logging
  logLevel: getEnvString('LOG_LEVEL', 'info') as Config['logLevel'],
  logPretty: getEnvBoolean('LOG_PRETTY', true),

  // OpenClaw Plugin
  openclawPort: getEnvNumber('OPENCLAW_PORT', 3000),
  openclawHost: getEnvString('OPENCLAW_HOST', 'localhost'),

  // Performance
  httpTimeout: getEnvNumber('HTTP_TIMEOUT', 10000),
  maxRetries: getEnvNumber('MAX_RETRIES', 3),
  retryDelay: getEnvNumber('RETRY_DELAY', 1000),

  // Pro Features
  enableProFeatures: getEnvBoolean('ENABLE_PRO_FEATURES', false),
};

/**
 * Validates the configuration
 */
export function validateConfig(cfg: Config): string[] {
  const errors: string[] = [];

  if (!cfg.perplexityBaseUrl) {
    errors.push('PERPLEXITY_BASE_URL is required');
  }

  if (cfg.sessionTimeout <= 0) {
    errors.push('SESSION_TIMEOUT must be positive');
  }

  if (cfg.browserTimeout <= 0) {
    errors.push('BROWSER_TIMEOUT must be positive');
  }

  if (cfg.maxRetries < 0) {
    errors.push('MAX_RETRIES must be non-negative');
  }

  return errors;
}

/**
 * Gets the configuration for the application
 */
export function getConfig(): Config {
  return config;
}
