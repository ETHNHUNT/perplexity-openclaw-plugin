/**
 * Encrypted credential storage
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname } from 'node:path';
import type { AuthStorage } from './types.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { AuthenticationError } from '../utils/error-handler.js';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT = 'perplexity-openclaw-salt';

/**
 * Derives an encryption key from a password
 */
function deriveKey(password: string): Buffer {
  return scryptSync(password, SALT, KEY_LENGTH);
}

/**
 * Encrypts data
 */
function encrypt(data: string, password: string): string {
  if (!config.encryptionEnabled) {
    return Buffer.from(data).toString('base64');
  }

  const key = deriveKey(password);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  
  // Combine IV + encrypted data + auth tag
  return Buffer.concat([
    iv,
    Buffer.from(encrypted, 'hex'),
    authTag,
  ]).toString('base64');
}

/**
 * Decrypts data
 */
function decrypt(encryptedData: string, password: string): string {
  if (!config.encryptionEnabled) {
    return Buffer.from(encryptedData, 'base64').toString('utf8');
  }

  const key = deriveKey(password);
  const buffer = Buffer.from(encryptedData, 'base64');

  const iv = buffer.subarray(0, IV_LENGTH);
  const authTag = buffer.subarray(buffer.length - AUTH_TAG_LENGTH);
  const encrypted = buffer.subarray(IV_LENGTH, buffer.length - AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

/**
 * Saves authentication storage to disk
 */
export function saveAuthStorage(storage: AuthStorage, password?: string): void {
  try {
    const storagePath = config.authStoragePath;
    const dir = dirname(storagePath);

    // Ensure directory exists
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const data = JSON.stringify(storage);
    // Use environment variable or provided password, or disable encryption
    const encryptionKey = password ?? process.env.AUTH_ENCRYPTION_KEY;
    if (!encryptionKey && config.encryptionEnabled) {
      logger.warn('No encryption key provided and encryption is enabled. Storing unencrypted.');
    }
    const encrypted = encryptionKey ? encrypt(data, encryptionKey) : data;

    writeFileSync(storagePath, encrypted, 'utf8');
    logger.debug({ path: storagePath }, 'Auth storage saved');
  } catch (error) {
    throw new AuthenticationError(
      `Failed to save auth storage: ${error instanceof Error ? error.message : String(error)}`,
      error,
    );
  }
}

/**
 * Loads authentication storage from disk
 */
export function loadAuthStorage(password?: string): AuthStorage | null {
  try {
    const storagePath = config.authStoragePath;

    if (!existsSync(storagePath)) {
      logger.debug('No auth storage found');
      return null;
    }

    const encrypted = readFileSync(storagePath, 'utf8');
    
    // Use environment variable or provided password
    const encryptionKey = password ?? process.env.AUTH_ENCRYPTION_KEY;
    const decrypted = encryptionKey ? decrypt(encrypted, encryptionKey) : encrypted;
    const storage = JSON.parse(decrypted) as AuthStorage;

    logger.debug({ path: storagePath }, 'Auth storage loaded');
    return storage;
  } catch (error) {
    logger.error({ error }, 'Failed to load auth storage');
    return null;
  }
}

/**
 * Clears authentication storage
 */
export function clearAuthStorage(): void {
  try {
    const storagePath = config.authStoragePath;

    if (existsSync(storagePath)) {
      unlinkSync(storagePath);
      logger.info('Auth storage cleared');
    }
  } catch (error) {
    logger.error({ error }, 'Failed to clear auth storage');
  }
}
