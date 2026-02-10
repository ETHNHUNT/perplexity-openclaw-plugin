/**
 * Perplexity constants and configuration
 */

export const PERPLEXITY_URLS = {
  BASE: 'https://www.perplexity.ai',
  API: 'https://www.perplexity.ai/api',
  SEARCH: 'https://www.perplexity.ai/search',
  LOGIN: 'https://www.perplexity.ai/login',
} as const;

export const API_ENDPOINTS = {
  SEARCH: '/search',
  CHAT: '/chat',
  RESEARCH: '/research',
  EXTRACT: '/extract',
  USER: '/user',
} as const;

export const SELECTORS = {
  // Search page selectors
  SEARCH_INPUT: 'textarea[placeholder*="Ask"], input[type="text"]',
  SEARCH_BUTTON: 'button[type="submit"]',
  ANSWER_CONTAINER: '[data-testid="answer"], .answer-container, main article',
  SOURCE_LINKS: 'a[data-source], .source-link',
  RELATED_QUESTIONS: '[data-testid="related"], .related-question',

  // Login page selectors
  EMAIL_INPUT: 'input[type="email"], input[name="email"]',
  PASSWORD_INPUT: 'input[type="password"], input[name="password"]',
  LOGIN_BUTTON: 'button[type="submit"]',
  
  // Pro features
  DEEP_RESEARCH_BUTTON: '[data-feature="deep-research"]',
  MODEL_SELECTOR: '[data-testid="model-selector"]',
  PRO_BADGE: '[data-testid="pro-badge"]',

  // Chat
  CHAT_INPUT: 'textarea[data-testid="chat-input"]',
  CHAT_MESSAGE: '[data-testid="chat-message"]',
  CHAT_RESPONSE: '[data-testid="response"]',

  // Common
  LOADING_SPINNER: '[data-testid="loading"], .spinner, .loading',
  ERROR_MESSAGE: '[role="alert"], .error-message',
} as const;

export const MODELS = {
  DEFAULT: 'default',
  OPUS_4_5: 'opus-4.5',
  GPT_5_2: 'gpt-5.2',
  GEMINI_3_0: 'gemini-3.0',
  CLAUDE_3_5: 'claude-3.5',
} as const;

export const SEARCH_MODES = {
  CONCISE: 'concise',
  DETAILED: 'detailed',
} as const;

export const FOCUS_MODES = {
  INTERNET: 'internet',
  ACADEMIC: 'academic',
  WRITING: 'writing',
  WOLFRAM: 'wolfram',
  YOUTUBE: 'youtube',
  REDDIT: 'reddit',
} as const;

export const TIMEOUTS = {
  SEARCH: 30000,
  RESEARCH: 60000,
  CHAT: 20000,
  EXTRACT: 15000,
  PAGE_LOAD: 30000,
} as const;

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_MULTIPLIER: 2,
} as const;

export const PRO_FEATURES = {
  DEEP_RESEARCH: 'deep_research',
  MODEL_COUNCIL: 'model_council',
  UNLIMITED_QUERIES: 'unlimited_queries',
  ADVANCED_MODELS: 'advanced_models',
} as const;

export const DEFAULT_CONFIG = {
  maxRetries: 3,
  timeout: 30000,
  headless: true,
  waitForSelector: 5000,
} as const;
