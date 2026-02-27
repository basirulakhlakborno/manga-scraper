import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import { errorResponse } from '../utils/response';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.requests = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up old entries periodically
    setInterval(() => this.cleanup(), this.windowMs);
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset existing one
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count < this.maxRequests) {
      entry.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests for identifier
   */
  getRemaining(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) return this.maxRequests;
    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) return Date.now() + this.windowMs;
    return entry.resetTime;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Create rate limiter instance
const limiter = new RateLimiter(config.rateLimitWindowMs, config.rateLimitMaxRequests);

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Use IP address as identifier
  const identifier = req.ip || req.socket.remoteAddress || 'unknown';

  if (!limiter.isAllowed(identifier)) {
    res.status(429).json(errorResponse('Too many requests. Please try again later.'));
    return;
  }

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', config.rateLimitMaxRequests);
  res.setHeader('X-RateLimit-Remaining', limiter.getRemaining(identifier));
  res.setHeader('X-RateLimit-Reset', new Date(limiter.getResetTime(identifier)).toISOString());

  next();
}
