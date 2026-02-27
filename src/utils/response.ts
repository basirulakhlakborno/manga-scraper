import { ApiResponse } from '../types';

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a standardized error response
 */
export function errorResponse(error: string): ApiResponse<null> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
