import type { PermissionNode } from './permission.types';
import type { User } from './user.types';
import type { KeycloakTokenParsed } from 'keycloak-js';

export interface TokenPayload extends KeycloakTokenParsed {
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  realm_access?: {
    roles: Array<string>;
  };
}

export interface AuthState {
  user: User | null;
  permissions: Array<PermissionNode> | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setPermissions: (permissions: Array<PermissionNode> | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  initialize: () => Promise<void>;
  reset: () => void;
}
