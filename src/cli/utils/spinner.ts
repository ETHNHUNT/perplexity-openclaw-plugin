/**
 * Loading spinner utility
 */

import ora, { type Ora } from 'ora';

/**
 * Creates and manages a loading spinner
 */
export class Spinner {
  private spinner: Ora;

  constructor(message: string) {
    this.spinner = ora({
      text: message,
      color: 'cyan',
    });
  }

  /**
   * Starts the spinner
   */
  start(message?: string): void {
    if (message) {
      this.spinner.text = message;
    }
    this.spinner.start();
  }

  /**
   * Updates the spinner message
   */
  update(message: string): void {
    this.spinner.text = message;
  }

  /**
   * Stops the spinner with success
   */
  succeed(message?: string): void {
    this.spinner.succeed(message);
  }

  /**
   * Stops the spinner with failure
   */
  fail(message?: string): void {
    this.spinner.fail(message);
  }

  /**
   * Stops the spinner with warning
   */
  warn(message?: string): void {
    this.spinner.warn(message);
  }

  /**
   * Stops the spinner with info
   */
  info(message?: string): void {
    this.spinner.info(message);
  }

  /**
   * Stops the spinner
   */
  stop(): void {
    this.spinner.stop();
  }

  /**
   * Clears the spinner
   */
  clear(): void {
    this.spinner.clear();
  }
}

/**
 * Creates a new spinner
 */
export function createSpinner(message: string): Spinner {
  return new Spinner(message);
}

/**
 * Runs an async function with a spinner
 */
export async function withSpinner<T>(
  message: string,
  fn: () => Promise<T>,
  successMessage?: string,
  errorMessage?: string,
): Promise<T> {
  const spinner = createSpinner(message);
  spinner.start();

  try {
    const result = await fn();
    spinner.succeed(successMessage ?? 'Done');
    return result;
  } catch (error) {
    spinner.fail(errorMessage ?? 'Failed');
    throw error;
  }
}
