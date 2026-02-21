import type { ApiResponse, NormalizedApiError, ApiError } from '@libs/types';
import type { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

/**
 * Configuration types for request methods
 */
type RequestOptions = Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>;
type MutationOptions = Omit<AxiosRequestConfig, 'url' | 'method'>;

/**
 * Standardized error unwrap logic.
 * Transforms a raw API error into a NormalizedApiError for consistent handling in modules.
 */
const normalizeError = (error: unknown): NormalizedApiError => {
  const defaultError: NormalizedApiError = {
    message: 'An unexpected error occurred',
    details: {},
  };

  if (typeof error === 'object' && error !== null) {
    const apiErr = error as ApiError;
    if (apiErr.success === false && apiErr.error) {
      return {
        message: apiErr.error.message || defaultError.message,
        code: apiErr.error.code,
        details: (apiErr.error.details || []).reduce((acc: Record<string, string>, curr: { field: string; message: string }) => {
          acc[curr.field] = curr.message;
          return acc;
        }, {}),
        raw: apiErr,
      };
    }
  }

  if (error instanceof Error) {
    return { ...defaultError, message: error.message };
  }

  return defaultError;
};

/**
 * Extracts the data payload from a standardized API response.
 * Throws a NormalizedApiError if the response indicates failure.
 */
const unwrapResponse = <TData>(response: ApiResponse<TData>): TData => {
  if (response.success) {
    return response.data;
  }

  throw normalizeError(response);
};

/**
 * Universal HTTP Service
 * 
 * A thin, typed abstraction over Axios that returns unwrapped 'data' 
 * directly from the standardized ApiResponse structure.
 */
export const http = {
  get: async <TResponse>(url: string, config?: RequestOptions): Promise<TResponse> => {
    const response = await axiosInstance.get<ApiResponse<TResponse>>(url, config);
    return unwrapResponse(response.data);
  },

  delete: async <TResponse>(url: string, config?: RequestOptions): Promise<TResponse> => {
    const response = await axiosInstance.delete<ApiResponse<TResponse>>(url, config);
    return unwrapResponse(response.data);
  },

  post: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: MutationOptions
  ): Promise<TResponse> => {
    const response = await axiosInstance.post<ApiResponse<TResponse>>(url, body, config);
    return unwrapResponse(response.data);
  },

  put: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: MutationOptions
  ): Promise<TResponse> => {
    const response = await axiosInstance.put<ApiResponse<TResponse>>(url, body, config);
    return unwrapResponse(response.data);
  },

  patch: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: MutationOptions
  ): Promise<TResponse> => {
    const response = await axiosInstance.patch<ApiResponse<TResponse>>(url, body, config);
    return unwrapResponse(response.data);
  },
};

export default http;
