#!/usr/bin/env node
/**
 * Status command - Shows authentication and session status
 */

import { getSessionStatus } from '../../auth/session-manager.js';
import type { StatusCommandOptions } from '../../types/cli.js';
import { logger } from '../../utils/logger.js';
import {
  formatHeader,
  formatInfo,
  formatOutput,
  formatSuccess,
  formatWarning,
} from '../utils/formatter.js';

/**
 * Formats time remaining in human-readable format
 */
function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Main status command handler
 */
export async function statusCommand(options: StatusCommandOptions): Promise<void> {
  try {
    logger.info({ options }, 'Status command started');

    const status = getSessionStatus();

    if (options.output === 'json') {
      console.log(formatOutput(status, 'json'));
      return;
    }

    console.log(formatHeader('Authentication Status'));
    console.log('');

    if (status.authenticated) {
      console.log(formatSuccess('Authenticated'));
      console.log('');

      console.log(formatInfo('Session Information:'));

      if (status.userId) {
        console.log(`  User: ${status.userId}`);
      }

      if (status.expiresAt) {
        console.log(`  Expires: ${new Date(status.expiresAt).toLocaleString()}`);
      }

      if (status.timeRemaining !== undefined) {
        console.log(`  Time Remaining: ${formatTimeRemaining(status.timeRemaining)}`);
      }
    } else {
      console.log(formatWarning('Not authenticated'));
      console.log('');
      console.log(formatInfo('Run "perplexity-cli login" to authenticate'));
    }

    logger.info('Status command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Status command failed');
    console.log(formatWarning('Could not retrieve status'));
  }
}
