import type { AxiosResponse, AxiosError } from 'axios';
import axiosInstance from './axios.instance';
import type { ApiResponse, RequestConfig, AppError, ApiErrorResponse } from './http.types';
import { mapBackendErrorToAppError, mapUnknownToAppError } from './http.error';

const unwrap = async <T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> => {
  try {
    const res = await promise;

    if (!res.data.success) {
      throw mapBackendErrorToAppError(res.data as ApiErrorResponse, res.status);
    }

    return res.data;
  } catch (error) {
    if ((error as AppError).message && (error as AppError).status !== undefined) {
      throw error;
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
