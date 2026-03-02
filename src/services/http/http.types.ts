import type {
  ApiResponse,
  NormalizedApiError
} from '@libs/types';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type {
  ApiError,
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  NormalizedApiError,
  PaginationResult
} from '@libs/types';

/**
 * AppError
 * - Standard error shape thrown by `http.*` methods.
 * - Alias to `NormalizedApiError` (shared in @libs/types).
 */
export type AppError = NormalizedApiError;

export type RequestConfig<D = unknown> = AxiosRequestConfig<D>;
export type Response<T = unknown> = AxiosResponse<ApiResponse<T>>;
