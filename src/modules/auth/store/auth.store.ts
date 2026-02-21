import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AxiosError } from 'axios';

import type { AuthState, PermissionNode, UserMe, UserProfile } from '@libs/types';
import { login, logout } from '../api/keycloak';

export interface KeycloakAuthState {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
  userProfile: UserProfile | null;
  isInitialized: boolean;
  setAuth: (payload: { isAuthenticated: boolean; token?: string; refreshToken?: string; userProfile: UserProfile | null }) => void;
  setInitialized: (isInitialized: boolean) => void;
  login: (redirectUri?: string) => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
}

export const useAuthStore = create<KeycloakAuthState>()(devtools((set) => ({
  isAuthenticated: false,
  token: undefined,
  refreshToken: undefined,
  userProfile: null,
  isInitialized: false,
  setAuth: (payload) => set((state) => ({ ...state, ...payload })),
  setInitialized: (isInitialized) => set({ isInitialized }),
  login: async (redirectUri) => login(redirectUri),
  logout: async (redirectUri) => logout(redirectUri),
}), { name: 'AuthStore' }));
import { authService } from '../api/auth.api';
import { userService } from '../../users/api/user.api';

const initialState: Pick<
  AuthState,
  'user' | 'permissions' | 'isLoading' | 'isInitialized' | 'error' | 'rbacMode'
> = {
  user: null,
  permissions: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  rbacMode: 'strict',
};

const getAxiosStatus = (err: unknown): number | undefined => {
  const axiosErr = err as AxiosError;
  return axiosErr?.response?.status;
};

const getAxiosMessage = (err: unknown): string | undefined => {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return axiosErr?.response?.data?.message;
};

export const useRbacStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUser: (user: UserMe | null) => set({ user }),
      setPermissions: (permissions: Array<PermissionNode> | null) => set({ permissions }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      setInitialized: (isInitialized: boolean) => set({ isInitialized }),
      reset: () => set(initialState),

      initialize: async () => {
        const { isInitialized, isLoading } = get();
        if (isInitialized || isLoading) return;

        // Don't call backend if Keycloak is not authenticated
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          set({ user: null, permissions: null, isInitialized: true, isLoading: false, error: null });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // 1) /users/me
          const user = await userService.getMe();
          set({ user });

          // 2) /roles/{roleId}/permissions
          const roleId = user.role_id;
          if (!roleId) {
            // Strict mode: if no role_id, user effectively has no permissions.
            set({ permissions: null, isInitialized: true });
            return;
          }

          const permissionTree = await authService.getPermissions(roleId);
          set({ permissions: permissionTree, isInitialized: true });
        } catch (err: unknown) {
          const status = getAxiosStatus(err);
          const msg = getAxiosMessage(err);

          // If /me fails: logout (per spec)
          if (status === 401 || status === 403) {
            useAuthStore.getState().logout();
          }

          // If permissions fail: keep session, but deny access by redirecting to /403 via guards.
          set({
            error: msg ?? (err instanceof Error ? err.message : 'RBAC init failed'),
            isInitialized: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'RbacStore' }
  )
);
