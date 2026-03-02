import type { KeycloakTokenParsed } from 'keycloak-js';

export interface Actions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface PermissionNode {
  id: number;
  name: string;
  module: string;
  subModule: string;
  actions: Actions;
}

export interface RolePermissionsResponse {
  data: Array<PermissionNode>;
  success: boolean;
  message: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  roleId: number;
}

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

export interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: Array<string>;
  [key: string]: unknown;
}

export interface AuthState {
  user: CurrentUser | null;
  permissions: Array<PermissionNode> | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: CurrentUser | null) => void;
  setPermissions: (permissions: Array<PermissionNode> | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  initialize: () => Promise<void>;
  reset: () => void;
}
