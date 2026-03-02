import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type {
  AuthState,
  CurrentUser,
  PermissionNode,
  UserProfile,
} from '@libs/types';
import type { AppError } from '@services/http';
import { authService } from '../api/auth.api';
import { login, logout } from '../api/keycloak';

export interface KeycloakAuthState {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
  userProfile: UserProfile | null;
  isInitialized: boolean;
  setAuth: (payload: {
    isAuthenticated: boolean;
    token?: string;
    refreshToken?: string;
    userProfile: UserProfile | null;
  }) => void;
  setInitialized: (isInitialized: boolean) => void;
  login: (redirectUri?: string) => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
}

export const useAuthStore = create<KeycloakAuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      token: undefined,
      refreshToken: undefined,
      userProfile: null,
      isInitialized: false,
      setAuth: (payload) => set((state) => ({ ...state, ...payload })),
      setInitialized: (isInitialized) => set({ isInitialized }),
      login: async (redirectUri) => login(redirectUri),
      logout: async (redirectUri) => logout(redirectUri),
    }),
    { name: 'AuthStore' },
  ),
);

const initialState: Pick<
  AuthState,
  'user' | 'permissions' | 'isLoading' | 'isInitialized' | 'error'
> = {
  user: null,
  permissions: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

const getErrorStatus = (err: unknown): number | undefined => {
  const appError = err as AppError | undefined;
  return appError?.status;
};

const getErrorMessage = (err: unknown): string | undefined => {
  const appError = err as AppError | undefined;
  return appError?.message;
};

export const useRbacStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUser: (user: CurrentUser | null) => set({ user }),
      setPermissions: (permissions: Array<PermissionNode> | null) =>
        set({ permissions }),
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
          set({
            user: null,
            permissions: null,
            isInitialized: true,
            isLoading: false,
            error: null,
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const userResponse = await authService.getMe();
          const user = userResponse.data;
          set({ user });

          const roleId = user.roleId;
          if (!roleId) {
            set({ permissions: null, isInitialized: true });
            return;
          }

          const permissionsResponse =
            await authService.getPermissions(roleId);
          set({
            permissions: permissionsResponse.data,
            isInitialized: true,
          });
        } catch (err: unknown) {
          const status = getErrorStatus(err);
          const msg = getErrorMessage(err);

          // If /me fails: logout (per spec)
          if (status === 401 || status === 403) {
            useAuthStore.getState().logout();
          }

          // If permissions fail: keep session, but deny access by redirecting to /403 via guards.
          set({
            error:
              msg ?? (err instanceof Error ? err.message : 'RBAC init failed'),
            isInitialized: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'RbacStore' },
  ),
);
