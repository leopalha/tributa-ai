/**
 * Utility functions for API error handling
 */

// Helper for error handling in API routes
export function handleApiError(
  error: unknown,
  defaultMessage = 'Ocorreu um erro interno no servidor'
) {
  console.error('API Error:', error);

  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  const status = error instanceof Error && 'status' in error ? (error as any).status : 500;

  return {
    error: errorMessage,
    status,
    timestamp: new Date().toISOString(),
  };
}

// Create a standard error response format
export function formatErrorResponse(message: string, code = 'INTERNAL_SERVER_ERROR', status = 500) {
  return {
    error: {
      message,
      code,
      timestamp: new Date().toISOString(),
    },
    status,
  };
}

// Create a standard success response format
export function formatSuccessResponse<T>(data: T, message = 'Operação realizada com sucesso') {
  return {
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

// Validate that a request has required fields
export function validateRequestFields(
  body: any,
  requiredFields: string[],
  errorMessage = 'Campos obrigatórios não informados'
): { isValid: boolean; missingFields?: string[]; errorMessage?: string } {
  const missingFields = requiredFields.filter(field => {
    const value = field
      .split('.')
      .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), body);
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    return {
      isValid: false,
      missingFields,
      errorMessage: `${errorMessage}: ${missingFields.join(', ')}`,
    };
  }

  return { isValid: true };
}
