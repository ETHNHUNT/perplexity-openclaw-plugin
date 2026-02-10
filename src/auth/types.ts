/**
 * Authentication-related types
 */

import type { Cookie, Session } from '../types/common.js';

export interface AuthCredentials {
  email?: string;
  cookies: Cookie[];
  sessionToken?: string;
  expiresAt: number;
}

export interface LoginResult {
  success: boolean;
  session?: Session;
  error?: string;
}

export interface AuthStorage {
  credentials?: AuthCredentials;
  lastUpdated: number;
}

export type AuthMethod = 'manual' | 'auto' | 'profile';
