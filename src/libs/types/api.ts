import type { PaginationResult } from './pagination';

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
  timestamp: number;
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

export interface NormalizedApiError {
  message: string;
  code?: string;
  details: Record<string, string>;
  raw?: ApiErrorResponse;
  status?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type { ApiErrorResponse as ApiError };
