import type { AxiosError } from 'axios';
import type { ApiErrorResponse, AppError } from './http.types';

export const mapBackendErrorToAppError = (
  backend: ApiErrorResponse,
  status?: number,
): AppError => {
  const fieldErrors: Record<string, string> = {};

  backend.error?.details?.forEach((d) => {
    if (d.field && d.message) {
      fieldErrors[d.field] = d.message;
    }
  });

  return {
    code: backend.error?.code ?? (status ? `HTTP_${status}` : 'UNKNOWN'),
    message: backend.error?.message ?? 'Request failed',
    fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    raw: backend,
    status,
  };
};

export const mapUnknownToAppError = (
  error: AxiosError<ApiErrorResponse>,
): AppError => {
  const status = error.response?.status;
  const data = error.response?.data;

  if (data && !data.success) {
    return mapBackendErrorToAppError(data, status);
  }

  return {
    code: status ? `HTTP_${status}` : 'NETWORK_ERROR',
    message: error.message || 'Network error',
    fieldErrors: undefined,
    status,
  };
};
