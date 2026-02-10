/**
 * Input validation utilities
 */

import { ValidationError } from './error-handler.js';

/**
 * Validates that a value is not empty
 */
export function validateNotEmpty(value: string, fieldName: string): void {
  if (!value || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} cannot be empty`);
  }
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): void {
  validateNotEmpty(email, 'Email');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

/**
 * Validates a URL
 */
export function validateUrl(url: string): void {
  validateNotEmpty(url, 'URL');

  try {
    new URL(url);
  } catch {
    throw new ValidationError(`Invalid URL: ${url}`);
  }
}

/**
 * Validates a file path (checks for empty and parent directory traversal)
 */
export function validatePath(path: string, fieldName = 'Path'): void {
  validateNotEmpty(path, fieldName);

  if (path.includes('..')) {
    throw new ValidationError(`${fieldName} cannot contain '..'`);
  }
}

/**
 * Validates a positive number
 */
export function validatePositiveNumber(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number`);
  }
}

/**
 * Validates a non-negative number
 */
export function validateNonNegativeNumber(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new ValidationError(`${fieldName} must be a non-negative number`);
  }
}

/**
 * Validates an enum value
 */
export function validateEnum<T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string,
): void {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
}

/**
 * Validates output format
 */
export function validateOutputFormat(format?: string): void {
  if (format) {
    validateEnum(format, ['json', 'table', 'text'] as const, 'Output format');
  }
}
