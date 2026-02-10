/**
 * Session lifecycle management
 */

import type { Session, Cookie } from '../types/common.js';
import type { AuthCredentials, AuthStorage } from './types.js';
import { loadAuthStorage, saveAuthStorage, clearAuthStorage } from './storage.js';
import { validatePerplexityCookies } from './cookie-manager.js';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

/**
 * Creates a new session from credentials
 */
export function createSession(credentials: AuthCredentials): Session {
  return {
    userId: credentials.email,
    cookies: credentials.cookies,
    expiresAt: credentials.expiresAt,
    createdAt: Date.now(),
    isValid: true,
  };
}

/**
 * Saves a session to storage
 */
export function saveSession(session: Session): void {
  const storage: AuthStorage = {
    credentials: {
      email: session.userId,
      cookies: session.cookies,
      expiresAt: session.expiresAt,
    },
    lastUpdated: Date.now(),
  };

  saveAuthStorage(storage);
  logger.info('Session saved');
}

/**
 * Loads the current session from storage
 */
export function loadSession(): Session | null {
  const storage = loadAuthStorage();

  if (!storage?.credentials) {
    logger.debug('No stored session found');
    return null;
  }

  const session: Session = {
    userId: storage.credentials.email,
    cookies: storage.credentials.cookies,
    expiresAt: storage.credentials.expiresAt,
    createdAt: storage.lastUpdated,
    isValid: isSessionValid(storage.credentials),
  };

  logger.debug({ isValid: session.isValid }, 'Session loaded');
  return session;
}

/**
 * Checks if a session is valid
 */
export function isSessionValid(credentials: AuthCredentials): boolean {
  // Check expiration
  if (Date.now() >= credentials.expiresAt) {
    logger.debug('Session expired');
    return false;
  }

  // Validate cookies
  if (!validatePerplexityCookies(credentials.cookies)) {
    logger.debug('Invalid cookies');
    return false;
  }

  return true;
}

/**
 * Refreshes a session's expiration time
 */
export function refreshSession(session: Session): Session {
  const newExpiresAt = Date.now() + config.sessionTimeout;

  const refreshedSession: Session = {
    ...session,
    expiresAt: newExpiresAt,
  };

  saveSession(refreshedSession);
  logger.debug({ expiresAt: newExpiresAt }, 'Session refreshed');

  return refreshedSession;
}

/**
 * Invalidates and clears the current session
 */
export function clearSession(): void {
  clearAuthStorage();
  logger.info('Session cleared');
}

/**
 * Gets the current active session
 */
export function getCurrentSession(): Session | null {
  const session = loadSession();

  if (!session) {
    return null;
  }

  if (!session.isValid) {
    logger.warn('Current session is invalid');
    clearSession();
    return null;
  }

  return session;
}

/**
 * Updates session cookies
 */
export function updateSessionCookies(session: Session, cookies: Cookie[]): Session {
  const updatedSession: Session = {
    ...session,
    cookies,
  };

  saveSession(updatedSession);
  logger.debug({ cookieCount: cookies.length }, 'Session cookies updated');

  return updatedSession;
}

/**
 * Gets session status information
 */
export function getSessionStatus(): {
  authenticated: boolean;
  expiresAt?: number;
  timeRemaining?: number;
  userId?: string;
} {
  const session = getCurrentSession();

  if (!session) {
    return { authenticated: false };
  }

  const timeRemaining = session.expiresAt - Date.now();

  return {
    authenticated: true,
    expiresAt: session.expiresAt,
    timeRemaining: Math.max(0, timeRemaining),
    userId: session.userId,
  };
}
