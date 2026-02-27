import axios, { AxiosInstance, AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../config/config';

interface CacheEntry {
  data: any;
  timestamp: number;
}

export class HttpClient {
  private client: AxiosInstance;
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers
    });

    this.cache = new Map();
    this.cacheTTL = config.cacheTTL;
    this.maxRetries = config.maxRetries;
    this.retryDelay = config.retryDelay;

    // Clean cache periodically
    if (config.cacheEnabled) {
      setInterval(() => this.cleanCache(), config.cacheCleanupInterval);
    }
  }

  /**
   * Get data from cache if available and not expired
   */
  private getFromCache(key: string): any | null {
    if (!config.cacheEnabled) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.cacheTTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Save data to cache
   */
  private saveToCache(key: string, data: any): void {
    if (!config.cacheEnabled) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clean expired cache entries
   */
  private cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return {
      size: this.cache.size,
      enabled: config.cacheEnabled,
      ttl: this.cacheTTL
    };
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch and parse HTML from a URL with retry logic
   */
  async fetchPage(url: string, useCache: boolean = true): Promise<cheerio.CheerioAPI | null> {
    // Check cache first
    if (useCache) {
      const cached = this.getFromCache(url);
      if (cached) {
        return cheerio.load(cached);
      }
    }

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.client.get(url);
        const html = response.data;

        // Save to cache
        if (useCache) {
          this.saveToCache(url, html);
        }

        return cheerio.load(html);
      } catch (error) {
        lastError = error as Error;
        const axiosError = error as AxiosError;

        // Don't retry on 4xx errors (client errors)
        if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          console.error(`Client error ${axiosError.response.status} for ${url}`);
          return null;
        }

        // Log retry attempt
        if (attempt < this.maxRetries) {
          console.warn(`Attempt ${attempt} failed for ${url}. Retrying in ${this.retryDelay}ms...`);
          await this.sleep(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    console.error(`Failed to fetch ${url} after ${this.maxRetries} attempts:`, lastError?.message);
    return null;
  }

  /**
   * Make a raw GET request
   */
  async get(url: string): Promise<any> {
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, (error as Error).message);
      throw error;
    }
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
