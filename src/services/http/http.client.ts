import axiosInstance from './axios.instance';
import { mapBackendErrorToAppError, mapUnknownToAppError } from './http.error';

import type {
  ApiResponse,
  ApiSuccessResponse,
  RequestConfig,
  AppError,
  ApiErrorResponse,
} from './http.types';
import type { AxiosResponse, AxiosError } from 'axios';

const unwrap = async <T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiSuccessResponse<T>> => {
  try {
    const res = await promise;

    if (!res.data.success) {
      throw mapBackendErrorToAppError(res.data as ApiErrorResponse, res.status);
    }

    return res.data as ApiSuccessResponse<T>;
  } catch (error) {
    const appError = error as AppError;
    // If it's already mapped to AppError, rethrow as-is.
    if (
      appError &&
      typeof appError.message === 'string' &&
      (appError.code || appError.raw || appError.status !== undefined)
    ) {
      throw appError;
    }
    throw mapUnknownToAppError(error as AxiosError<ApiErrorResponse>);
  }
};

export const http = {
  get: <T>(url: string, config?: RequestConfig) =>
    unwrap<T>(axiosInstance.get<ApiResponse<T>>(url, config)),

  post: <T, B = unknown>(url: string, body?: B, config?: RequestConfig<B>) =>
    unwrap<T>(axiosInstance.post<ApiResponse<T>>(url, body, config)),

  put: <T, B = unknown>(url: string, body?: B, config?: RequestConfig<B>) =>
    unwrap<T>(axiosInstance.put<ApiResponse<T>>(url, body, config)),

  patch: <T, B = unknown>(url: string, body?: B, config?: RequestConfig<B>) =>
    unwrap<T>(axiosInstance.patch<ApiResponse<T>>(url, body, config)),

  delete: <T = void>(url: string, config?: RequestConfig) =>
    unwrap<T>(axiosInstance.delete<ApiResponse<T>>(url, config)),
};
