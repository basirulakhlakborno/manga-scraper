import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  logger.error(`Error on ${req.method} ${req.path}:`, err);
  
  // Default to 500 if no status is set
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json(errorResponse(err.message || 'Internal server error'));
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(errorResponse(`Endpoint not found: ${req.method} ${req.path}`));
}
