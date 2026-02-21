import { envConfig } from './env';

export const keycloakConfig = {
  url: envConfig.KEYCLOAK_URL,
  realm: envConfig.KEYCLOAK_REALM,
  clientId: envConfig.KEYCLOAK_CLIENT_ID,
} as const;

export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  pkceMethod: 'S256' as const,
  checkLoginIframe: false,
  enableLogging: import.meta.env.DEV,
  responseMode: 'fragment' as const,
} as const;
