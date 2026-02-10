/**
 * HTTP client with retry logic
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { config } from './config.js';
import { NetworkError } from './error-handler.js';
import { logger } from './logger.js';

/**
 * HTTP client with automatic retries and timeout
 */
export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL,
      timeout: config.httpTimeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'perplexity-openclaw-plugin/1.0.0',
      },
    });
  }

  /**
   * Performs a GET request with retry logic
   */
  async get<T = unknown>(url: string, axiosConfig?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...axiosConfig });
  }

  /**
   * Performs a POST request with retry logic
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    axiosConfig?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...axiosConfig });
  }

  /**
   * Performs a request with retry logic
   */
  private async request<T>(requestConfig: AxiosRequestConfig, attempt = 1): Promise<T> {
    try {
      logger.debug({ url: requestConfig.url, attempt }, 'Making HTTP request');
      const response: AxiosResponse<T> = await this.client.request(requestConfig);
      return response.data;
    } catch (error) {
      if (attempt < config.maxRetries) {
        const delay = config.retryDelay * attempt;
        logger.warn(
          { url: requestConfig.url, attempt, delay },
          `Request failed, retrying in ${delay}ms`,
        );
        await this.sleep(delay);
        return this.request<T>(requestConfig, attempt + 1);
      }

      logger.error({ url: requestConfig.url, error }, 'HTTP request failed');
      throw new NetworkError(
        `HTTP request failed: ${error instanceof Error ? error.message : String(error)}`,
        error,
      );
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Sets a custom header
   */
  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  /**
   * Sets cookies for requests
   */
  setCookies(cookies: string): void {
    this.setHeader('Cookie', cookies);
  }
}

/**
 * Creates a new HTTP client instance
 */
export function createHttpClient(baseURL?: string): HttpClient {
  return new HttpClient(baseURL);
}
