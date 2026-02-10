/**
 * Structured logging utility
 */

import pinoModule from 'pino';
import { config } from './config.js';

// Handle both ESM and CJS exports
const pino = (pinoModule as any).default || pinoModule;

/**
 * Create a logger instance
 */
export const logger = pino({
  level: config.logLevel,
  transport: config.logPretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log levels for easy reference
 */
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;
