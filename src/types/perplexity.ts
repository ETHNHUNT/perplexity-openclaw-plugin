/**
 * Perplexity-specific types
 */

export interface SearchOptions {
  query: string;
  mode?: 'concise' | 'detailed';
  focus?: 'internet' | 'academic' | 'writing' | 'wolfram' | 'youtube' | 'reddit';
  proSearch?: boolean;
}

export interface SearchResult {
  answer: string;
  sources: Source[];
  relatedQuestions: string[];
  images?: ImageResult[];
  conversationId?: string;
  queryId?: string;
  timestamp: number;
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
  favicon?: string;
  index?: number;
}

export interface ImageResult {
  url: string;
  thumbnail?: string;
  alt?: string;
  source?: string;
}

export interface ResearchOptions {
  topic: string;
  deep?: boolean;
  maxDepth?: number;
}

export interface ResearchResult {
  summary: string;
  sections: ResearchSection[];
  sources: Source[];
  relatedTopics: string[];
  conversationId?: string;
  timestamp: number;
}

export interface ResearchSection {
  title: string;
  content: string;
  sources: number[];
}

export interface ChatOptions {
  message: string;
  conversationId?: string;
  model?: 'default' | 'opus-4.5' | 'gpt-5.2' | 'gemini-3.0';
  modelCouncil?: boolean;
}

export interface ChatResult {
  response: string;
  conversationId: string;
  sources?: Source[];
  timestamp: number;
}

export interface ExtractUrlOptions {
  url: string;
  depth?: number;
  includeLinks?: boolean;
}

export interface ExtractUrlResult {
  content: string;
  title?: string;
  author?: string;
  publishDate?: string;
  links?: string[];
  images?: string[];
  timestamp: number;
}

export interface PerplexityApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    requestId: string;
    timestamp: number;
    quota?: QuotaInfo;
  };
}

export interface QuotaInfo {
  remaining: number;
  total: number;
  resetAt: number;
}

export interface ProFeatures {
  deepResearch: boolean;
  modelCouncil: boolean;
  unlimitedQueries: boolean;
  advancedModels: boolean;
}
