import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { keycloak, login, refreshToken } from '@modules/auth/api/keycloak';
import { envConfig } from '@libs/configs';
import type { ApiError, ApiResponse } from '@libs/types';

// -----------------
// Environment
// -----------------

const DEFAULT_BASE_URL = 'http://localhost:3000/api';

const getApiBaseUrl = (): string => {
  const viteUrl = import.meta.env.VITE_API_BASE_URL;
  if (viteUrl) return viteUrl;

  // @ts-expect-error - process.env might exist in CRA environments
  const craUrl = typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined;
  if (craUrl) return craUrl;

  return envConfig.API_BASE_URL || DEFAULT_BASE_URL;
};

const API_BASE_URL = getApiBaseUrl();

// -----------------
// Types
// -----------------

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _netRetry?: boolean;
};

type ApiClientError = AxiosError<ApiError> & {
  config: RetryableRequestConfig;
};

// -----------------
// Private helpers
// -----------------

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const safeLoginRedirect = async () => {
  if (window.location.pathname === '/login') return;
  await login(window.location.href);
};

const ensureFreshToken = async (minValiditySeconds = 60): Promise<string | undefined> => {
  if (!keycloak.authenticated) return undefined;
  return refreshToken(minValiditySeconds);
};

const isApiErrorShape = (value: unknown): value is ApiError => {
  if (!value || typeof value !== 'object') return false;

  const v = value as Record<string, unknown>;
  if (v.success !== false) return false;
  if (typeof v.timestamp !== 'number') return false;
  if (!v.error || typeof v.error !== 'object') return false;

  const err = v.error as Record<string, unknown>;
  return typeof err.message === 'string';
};

const createApiError = (params: {
  message: string;
  code?: string;
  details?: ApiError['error']['details'];
}): ApiError => ({
  success: false,
  error: {
    message: params.message,
    code: params.code ?? 'UNKNOWN_ERROR',
    details: params.details,
  },
  timestamp: Date.now(),
});

const shouldRetryNetworkError = (error: ApiClientError): boolean => {
  const status = error.response?.status;
  const isNetworkError = !error.response;
  const isServerError = typeof status === 'number' && status >= 500;
  return isNetworkError || isServerError;
};

const shouldRetryAuth = (error: ApiClientError): boolean => {
  return error.response?.status === 401;
};

// -----------------
// Axios instance
// -----------------

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// -----------------
// Interceptors
// -----------------

const onRequest = async (config: InternalAxiosRequestConfig) => {
  if (!keycloak.authenticated) return config;

  const token = await ensureFreshToken(60);
  if (token && config.headers) {
    // config.headers.Authorization = `Bearer ${token}`;
    config.headers.Authorization = `Bearer mock-jwt-token-john`;
  }

  return config;
};

const onRequestError = (error: AxiosError) => Promise.reject(error);

const onResponse = (response: AxiosResponse<ApiResponse<unknown>>) => {
  if (response.data && typeof response.data === 'object' && 'success' in response.data) {
    const apiResponse = response.data as ApiResponse<unknown>;
    if (apiResponse.success === false) {
      const apiError = apiResponse as unknown as ApiError;
      return Promise.reject(
        createApiError({
          message: apiError.error?.message ?? 'Request failed',
          code: apiError.error?.code ?? 'API_ERROR',
          details: apiError.error?.details,
        })
      );
    }
  }

  return response;
};

const onResponseError = async (error: ApiClientError) => {
  const config = error.config;

  // 1) Retry once on network/5xx
  if (shouldRetryNetworkError(error) && config && !config._netRetry) {
    config._netRetry = true;
    await sleep(300);
    return axiosInstance(config);
  }

  // 2) Retry once on 401 after refresh
  if (shouldRetryAuth(error) && config && !config._retry) {
    config._retry = true;

    try {
      const token = await ensureFreshToken(0);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(config);
      }
    } catch {
      // fall through to login redirect
    }

    await safeLoginRedirect();
  }

  // 3) Preserve standardized backend error payload
  if (error.response?.data && isApiErrorShape(error.response.data)) {
    return Promise.reject(error.response.data);
  }

  // 4) Normalize unknown/network errors
  const status = error.response?.status;
  return Promise.reject(
    createApiError({
      message: error.message || 'Network error',
      code: status ? `HTTP_${status}` : 'NETWORK_ERROR',
    })
  );
};

axiosInstance.interceptors.request.use(onRequest, onRequestError);
axiosInstance.interceptors.response.use(onResponse, onResponseError);

export default axiosInstance;
