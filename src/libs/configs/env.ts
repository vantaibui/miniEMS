interface EnvConfig {
  API_BASE_URL: string;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
}

const env = import.meta.env;

export const envConfig: EnvConfig = {
  API_BASE_URL: env.VITE_API_BASE_URL as string,
  KEYCLOAK_URL: env.VITE_KEYCLOAK_URL as string,
  KEYCLOAK_REALM: env.VITE_KEYCLOAK_REALM as string,
  KEYCLOAK_CLIENT_ID: env.VITE_KEYCLOAK_CLIENT_ID as string,
} as const;
