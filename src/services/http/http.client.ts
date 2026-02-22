import type { AxiosResponse } from 'axios';
import axiosInstance from './axios.instance';
import type { ApiResponse, RequestConfig } from './http.types';

const unwrap = async <T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> => {
  const res = await promise;

  // If interceptor is correctly set up, any `success: false` payload should already be thrown.
  // This guard keeps type safety and prevents runtime issues if interceptor is bypassed.
  if (!res.data.success) {
    throw new Error('Unexpected API structure');
  }
  return res.data.data;
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
