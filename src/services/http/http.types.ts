import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface PaginationResult {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

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

export interface AppError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  raw?: ApiErrorResponse;
  status?: number;
}

export type RequestConfig<D = unknown> = AxiosRequestConfig<D>;
export type Response<T = unknown> = AxiosResponse<ApiResponse<T>>;
