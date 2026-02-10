/**
 * Centralized error handling
 */

import type { ErrorResponse } from '../types/common.js';
import { logger } from './logger.js';

/**
 * Custom application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 503, details);
    this.name = 'NetworkError';
  }
}

export class BrowserError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, details);
    this.name = 'BrowserError';
  }
}

/**
 * Converts an error to an ErrorResponse
 */
export function toErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.name,
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    error: 'UnknownError',
    message: String(error),
    statusCode: 500,
  };
}

/**
 * Handles and logs errors
 */
export function handleError(error: unknown, context?: string): never {
  const errorResponse = toErrorResponse(error);
  
  logger.error({
    context,
    error: errorResponse,
  }, `Error: ${errorResponse.message}`);

  throw error;
}

/**
 * Wraps async functions with error handling
 */
export function withErrorHandler<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string,
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context);
    }
  };
}
