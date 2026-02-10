#!/usr/bin/env node
/**
 * Logout command - Clears credentials and session
 */

import { clearSession } from '../../auth/session-manager.js';
import { logger } from '../../utils/logger.js';
import { formatInfo, formatSuccess } from '../utils/formatter.js';
import { promptConfirm } from '../utils/prompts.js';

/**
 * Main logout command handler
 */
export async function logoutCommand(): Promise<void> {
  try {
    logger.info('Logout command started');

    console.log(formatInfo('This will clear your stored credentials and session.'));
    const confirmed = await promptConfirm('Are you sure you want to logout?', true);

    if (!confirmed) {
      console.log(formatInfo('Logout cancelled'));
      return;
    }

    clearSession();
    console.log(formatSuccess('Logged out successfully'));
    console.log(formatInfo('Your credentials have been cleared'));

    logger.info('Logout command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Logout command failed');
    console.log(formatInfo('Logout completed'));
  }
}
