/**
 * CLI-specific types
 */

import type { OutputFormat } from './common.js';

export interface LoginCommandOptions {
  manual?: boolean;
  auto?: boolean;
  profile?: string;
}

export interface SearchCommandOptions {
  output?: OutputFormat;
  mode?: 'concise' | 'detailed';
  focus?: string;
  pro?: boolean;
}

export interface ResearchCommandOptions {
  output?: OutputFormat;
  deep?: boolean;
  maxDepth?: number;
}

export interface ChatCommandOptions {
  output?: OutputFormat;
  conversationId?: string;
  model?: string;
  modelCouncil?: boolean;
}

export interface ExtractUrlCommandOptions {
  output?: OutputFormat;
  depth?: number;
  includeLinks?: boolean;
}

export interface StatusCommandOptions {
  output?: OutputFormat;
}

export interface CliContext {
  verbose: boolean;
  debug: boolean;
}

export interface TableColumn {
  header: string;
  key: string;
  width?: number;
}

export interface FormattedOutput {
  format: OutputFormat;
  data: unknown;
  columns?: TableColumn[];
}
