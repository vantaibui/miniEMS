import Keycloak from 'keycloak-js';

import { keycloakConfig, keycloakInitOptions } from '@libs/configs';
import { getStorage } from '@libs/utils';

import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
} from '@/modules/auth/constants/storage';

export const keycloak = new Keycloak({
  url: keycloakConfig.url ?? '',
  realm: keycloakConfig.realm ?? '',
  clientId: keycloakConfig.clientId ?? '',
});

let initPromise: Promise<boolean> | null = null;

export const initKeycloak = async (
  options?: Parameters<Keycloak['init']>[0],
): Promise<boolean> => {
  if (initPromise) return initPromise;

  const storedToken = getStorage<string>(AUTH_TOKEN_KEY);
  const storedRefreshToken = getStorage<string>(AUTH_REFRESH_TOKEN_KEY);

  initPromise = keycloak
    .init({
      ...keycloakInitOptions,
      ...(storedToken ? { token: storedToken } : {}),
      ...(storedRefreshToken ? { refreshToken: storedRefreshToken } : {}),
      ...options,
    })
    .catch((err) => {
      console.error('Keycloak init error:', err);
      return false;
    });

  return initPromise;
};

export const login = (redirectUri?: string) =>
  keycloak.login({ redirectUri: redirectUri || window.location.origin });

export const logout = (redirectUri?: string) =>
  keycloak.logout({ redirectUri: redirectUri || window.location.origin });
