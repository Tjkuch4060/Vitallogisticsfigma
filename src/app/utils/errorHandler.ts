/**
 * Centralized Error Handling
 * Consistent error handling across the application
 */

import { toast } from 'sonner';
import type { APIError } from '../types';

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

  if (isAPIError(error)) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is an API error
 */
export function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  );
}

/**
 * Handle error with toast notification
 */
export function handleError(error: unknown, context?: string): void {
  const message = getErrorMessage(error);
  const title = context ? `Error in ${context}` : 'An error occurred';

  console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);

  toast.error(title, {
    description: message,
    duration: 5000,
  });
}

/**
 * Handle success with toast notification
 */
export function handleSuccess(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

/**
 * Handle warning with toast notification
 */
export function handleWarning(message: string, description?: string): void {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

/**
 * Handle info with toast notification
 */
export function handleInfo(message: string, description?: string): void {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * Log error to external service (placeholder for Sentry, etc.)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  // In production, send to error tracking service (Sentry, LogRocket, etc.)
  console.error('Error logged:', {
    error,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  // Example Sentry integration:
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Create a typed error with code
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Network error handling
 */
export function handleNetworkError(error: unknown): void {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    handleError('Network error. Please check your internet connection.', 'Network');
  } else {
    handleError(error, 'Network');
  }
}

/**
 * Async error wrapper for try-catch blocks
 */
export async function tryAsync<T>(
  promise: Promise<T>,
  context?: string
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    if (context) {
      handleError(error, context);
    }
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Validation error handler
 */
export function handleValidationErrors(
  errors: Record<string, string[]>
): void {
  const firstError = Object.values(errors)[0]?.[0];
  if (firstError) {
    toast.error('Validation Error', {
      description: firstError,
      duration: 4000,
    });
  }
}
