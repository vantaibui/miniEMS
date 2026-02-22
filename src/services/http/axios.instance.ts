import axios, { type AxiosInstance } from 'axios';

import { envConfig } from '@libs/configs';
import { attachInterceptors } from './http.interceptor';

const DEFAULT_BASE_URL = 'http://localhost:3000/api';

const getApiBaseUrl = (): string => {
  const viteUrl = import.meta.env.VITE_API_BASE_URL;
  if (viteUrl) return viteUrl;

  // @ts-expect-error - process.env might exist in CRA environments
  const craUrl =
    typeof process !== 'undefined' ? process.env?.VITE_API_URL : undefined;
  if (craUrl) return craUrl;

  return envConfig.API_BASE_URL || DEFAULT_BASE_URL;
};

export const API_BASE_URL = getApiBaseUrl();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

attachInterceptors(axiosInstance);

export { axiosInstance };
export default axiosInstance;
