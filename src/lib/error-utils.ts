/**
 * Sanitize error messages to prevent information leakage
 * Maps database error codes to user-friendly messages
 */
export function sanitizeError(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  // Handle Supabase/PostgreSQL errors
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    const code = errorObj.code as string;
    const status = errorObj.status as number;
    
    // PostgreSQL error codes
    const pgErrorMap: Record<string, string> = {
      '23505': 'This record already exists.',
      '23503': 'Unable to complete operation due to related records.',
      '23502': 'Required information is missing.',
      '23514': 'The provided data is not valid.',
      '22P02': 'Invalid data format provided.',
      '42501': 'You do not have permission to perform this action.',
      '42P01': 'The requested resource was not found.',
      'PGRST116': 'Record not found.',
      'PGRST301': 'Unable to process request.',
    };

    // HTTP status code handling
    const httpErrorMap: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'Please sign in to continue.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This operation conflicts with existing data.',
      422: 'Unable to process the provided data.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Service temporarily unavailable.',
      503: 'Service temporarily unavailable.',
    };

    if (code && pgErrorMap[code]) {
      return pgErrorMap[code];
    }

    if (status && httpErrorMap[status]) {
      return httpErrorMap[status];
    }

    // Check for authentication-related errors
    const message = (errorObj.message as string)?.toLowerCase() || '';
    if (message.includes('jwt') || message.includes('token') || message.includes('auth')) {
      return 'Authentication error. Please sign in again.';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
  }

  // Default generic message
  return 'An error occurred. Please try again.';
}

/**
 * Log error details for debugging (server-side only)
 * In production, this should integrate with error tracking services
 */
export function logError(context: string, error: unknown): void {
  // Only log in development or to error tracking service
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  // In production, you would send to an error tracking service like Sentry
}
