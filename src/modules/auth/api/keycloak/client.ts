import Keycloak from 'keycloak-js';

import { keycloakConfig, keycloakInitOptions } from '@libs/configs';

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

  initPromise = keycloak
    .init({
      ...keycloakInitOptions,
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
