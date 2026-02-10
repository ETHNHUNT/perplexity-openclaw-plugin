/**
 * Common types shared across the application
 */

export interface User {
  id?: string;
  email?: string;
  name?: string;
  isPro: boolean;
}

export interface Session {
  userId?: string;
  token?: string;
  cookies: Cookie[];
  expiresAt: number;
  createdAt: number;
  isValid: boolean;
}

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface Config {
  perplexityBaseUrl: string;
  perplexityApiUrl: string;
  authStoragePath: string;
  sessionTimeout: number;
  encryptionEnabled: boolean;
  headlessBrowser: boolean;
  browserTimeout: number;
  navigationTimeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  logPretty: boolean;
  openclawPort: number;
  openclawHost: string;
  httpTimeout: number;
  maxRetries: number;
  retryDelay: number;
  enableProFeatures: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export type OutputFormat = 'json' | 'table' | 'text';

export interface BaseCommandOptions {
  output?: OutputFormat;
  verbose?: boolean;
}
