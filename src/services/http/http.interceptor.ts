import { keycloak, login, refreshToken } from '@modules/auth';
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { mapBackendErrorToAppError, mapUnknownToAppError } from './http.error';
import type { ApiErrorResponse, ApiResponse } from './http.types';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _netRetry?: boolean;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const safeLoginRedirect = async () => {
  if (window.location.pathname === '/login') return;
  await login(window.location.href);
};

const ensureFreshToken = async (
  minValiditySeconds = 60,
): Promise<string | undefined> => {
  if (!keycloak.authenticated) return undefined;
  return refreshToken(minValiditySeconds);
};

export const attachInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!keycloak.authenticated) return config;

      const token = await ensureFreshToken(60);
      if (token && config.headers) {
        // config.headers.Authorization = `Bearer ${token}`;
        config.headers['Authorization'] = `Bearer mock-jwt-token-john`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
      const data = response.data;
      if (data && !data.success) {
        throw mapBackendErrorToAppError(
          data as ApiErrorResponse,
          response.status,
        );
      }
      return response;
    },
    async (error) => {
      const config = error.config as RetryableRequestConfig | undefined;
      const status = error.response?.status;
      const isNetwork = !error.response;
      const isServer = typeof status === 'number' && status >= 500;

      // Retry network failure or 5xx errors
      if (config && !config._netRetry && (isNetwork || isServer)) {
        config._netRetry = true;
        await sleep(300);
        return instance(config);
      }

      // Retry 401 after token refresh
      if (config && status === 401 && !config._retry) {
        config._retry = true;
        try {
          const token = await ensureFreshToken(0);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            return instance(config);
          }
        } catch {
          /* ignore */
        }
        await safeLoginRedirect();
      }

      throw mapUnknownToAppError(error);
    },
  );

  return instance;
};
