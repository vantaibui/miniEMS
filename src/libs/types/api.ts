import type { PaginationResult } from './pagination';

// ----- Error response (from backend spec) -----

export interface ErrorDetails {
  field: string;
  message: string;
}

export interface ErrorData {
  message: string;
  details?: Array<ErrorDetails>;
  code?: string;
}

export interface BaseApiResponse {
  success: boolean;
  timestamp: number; // epoch millis
}

export interface ApiSuccessResponse<T> extends BaseApiResponse {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationResult;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: ErrorData;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ----- Frontend normalized error for UI (forms etc.) -----

export interface NormalizedApiError {
  message: string;
  code?: string;
  fieldErrors: Record<string, string>;
  raw?: ApiErrorResponse;
  status?: number;
}

export type ApiError = ApiErrorResponse;
