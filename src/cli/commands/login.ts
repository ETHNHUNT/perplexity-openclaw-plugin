#!/usr/bin/env node
/**
 * Login command - Supports manual, auto, and profile login methods
 */

import type { LoginCommandOptions } from '../../types/cli.js';
import { loadCookiesFromFile, cookiesToCredentials } from '../../auth/cookie-manager.js';
import { performAutoLogin } from '../../auth/auto-login.js';
import { loadProfileFromPath, findCommonProfilePaths } from '../../auth/profile-manager.js';
import { createSession, saveSession } from '../../auth/session-manager.js';
import { promptEmail, promptPassword, promptFilePath, promptLoginMethod, promptChoice, promptConfirm } from '../utils/prompts.js';
import { formatSuccess, formatError, formatInfo, formatWarning } from '../utils/formatter.js';
import { withSpinner } from '../utils/spinner.js';
import { logger } from '../../utils/logger.js';

/**
 * Handles manual cookie login
 */
async function handleManualLogin(): Promise<void> {
  console.log(formatInfo('Manual login: Export cookies from your browser'));
  console.log(formatInfo('1. Open https://www.perplexity.ai in your browser'));
  console.log(formatInfo('2. Log in to your account'));
  console.log(formatInfo('3. Open Developer Tools (F12)'));
  console.log(formatInfo('4. Go to Application/Storage > Cookies'));
  console.log(formatInfo('5. Export cookies as JSON'));
  console.log('');

  const cookieFilePath = await promptFilePath(
    'Enter path to cookie JSON file:',
    './cookies.json',
  );

  const cookies = await withSpinner(
    'Loading cookies...',
    async () => loadCookiesFromFile(cookieFilePath),
    'Cookies loaded successfully',
    'Failed to load cookies',
  );

  const credentials = cookiesToCredentials(cookies);
  const session = createSession(credentials);
  saveSession(session);

  console.log(formatSuccess('Login successful!'));
  console.log(formatInfo(`Session expires: ${new Date(session.expiresAt).toLocaleString()}`));
}

/**
 * Handles automated login
 */
async function handleAutoLogin(): Promise<void> {
  console.log(formatInfo('Automated login with email and password'));
  console.log('');

  const email = await promptEmail();
  const password = await promptPassword();

  const result = await withSpinner(
    'Logging in...',
    async () => performAutoLogin(email, password),
  );

  if (result.success && result.session) {
    saveSession(result.session);
    console.log(formatSuccess('Login successful!'));
    console.log(formatInfo(`Session expires: ${new Date(result.session.expiresAt).toLocaleString()}`));
  } else {
    console.log(formatError(`Login failed: ${result.error}`));
    process.exit(1);
  }
}

/**
 * Handles profile-based login
 */
async function handleProfileLogin(profilePath?: string): Promise<void> {
  let selectedPath = profilePath;

  if (!selectedPath) {
    console.log(formatInfo('Searching for existing profiles...'));
    const commonPaths = findCommonProfilePaths();

    if (commonPaths.length > 0) {
      console.log(formatInfo(`Found ${commonPaths.length} existing profile(s)`));
      const choices = [
        ...commonPaths,
        'Other (specify path)',
      ];

      selectedPath = await promptChoice(
        'Select a profile:',
        choices,
        commonPaths[0],
      );

      if (selectedPath === 'Other (specify path)') {
        selectedPath = await promptFilePath('Enter profile path:');
      }
    } else {
      console.log(formatWarning('No existing profiles found'));
      selectedPath = await promptFilePath('Enter profile path:');
    }
  }

  const credentials = await withSpinner(
    'Loading profile...',
    async () => loadProfileFromPath(selectedPath!),
    'Profile loaded successfully',
    'Failed to load profile',
  );

  const session = createSession(credentials);
  saveSession(session);

  console.log(formatSuccess('Login successful!'));
  console.log(formatInfo(`Session expires: ${new Date(session.expiresAt).toLocaleString()}`));
}

/**
 * Main login command handler
 */
export async function loginCommand(options: LoginCommandOptions): Promise<void> {
  try {
    logger.info({ options }, 'Login command started');

    // Determine login method
    let method: 'manual' | 'auto' | 'profile';

    if (options.manual) {
      method = 'manual';
    } else if (options.auto) {
      method = 'auto';
    } else if (options.profile) {
      method = 'profile';
    } else {
      // Prompt for method
      method = await promptLoginMethod();
    }

    // Execute appropriate login method
    switch (method) {
      case 'manual':
        await handleManualLogin();
        break;
      case 'auto':
        await handleAutoLogin();
        break;
      case 'profile':
        await handleProfileLogin(options.profile);
        break;
    }

    logger.info('Login command completed successfully');
  } catch (error) {
    logger.error({ error }, 'Login command failed');
    console.log(formatError(`Login failed: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}
