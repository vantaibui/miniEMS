import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// --- Pagination ---
export interface PaginationResult {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// --- Backend Contracts (Raw Response) ---
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

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// --- Frontend Normalized Error (UI use) ---
export interface AppError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  raw?: ApiErrorResponse;
  status?: number;
}

// --- Axios / Http Utils ---
export type RequestConfig<D = unknown> = AxiosRequestConfig<D>;
export type Response<T = unknown> = AxiosResponse<ApiResponse<T>>;
