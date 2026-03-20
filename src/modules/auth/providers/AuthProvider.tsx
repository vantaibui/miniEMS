import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './AuthContext';
import {
  initKeycloak,
  keycloak,
  login,
  logout,
  refreshToken,
  startSessionWatcher,
} from '../api/keycloak';
import { AUTH_REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY } from '../constants/storage';

import { clearStorage, setStorage } from '@/libs/utils';
import { useAuthStore } from '@/modules/auth/store/auth.store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitializedZustand = useAuthStore((s) => s.setInitialized);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isInitialized = useRef(false);

  const syncAuthState = useCallback(() => {
    const authenticated = !!keycloak.authenticated;
    setIsAuthenticated(authenticated);
    setToken(keycloak.token || null);

    if (authenticated) {
      setAuth({
        isAuthenticated: true,
        token: keycloak.token,
        refreshToken: keycloak.refreshToken,
      });

      setStorage(AUTH_TOKEN_KEY, keycloak.token);
      setStorage(AUTH_REFRESH_TOKEN_KEY, keycloak.refreshToken);
    } else {
      setAuth({
        isAuthenticated: false,
        token: undefined,
        refreshToken: undefined,
      });

      clearStorage();
    }
  }, [setAuth]);

  const handleLogin = useCallback(async (redirectUri?: string) => {
    await login(redirectUri);
  }, []);

  const handleLogout = useCallback(async (redirectUri?: string) => {
    await logout(redirectUri);
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    let stopWatcher: (() => void) | undefined;

    keycloak.onTokenExpired = () => {
      refreshToken(30).catch(() => {
        console.error('Token refresh failed, redirecting to login');
        handleLogin(window.location.href);
      });
    };

    keycloak.onAuthSuccess = syncAuthState;
    keycloak.onAuthRefreshSuccess = syncAuthState;
    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setToken(null);

      setAuth({
        isAuthenticated: false,
        token: undefined,
        refreshToken: undefined,
      });

      clearStorage();
    };

    const init = async () => {
      try {
        await initKeycloak();
        syncAuthState();

        if (keycloak.authenticated) {
          stopWatcher = startSessionWatcher({
            onRefreshError: () => {
              console.error('Session refresh failed, redirecting to login');
              handleLogin(window.location.href);
            },
          });
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak', error);
      } finally {
        setInitializedZustand(true);
        setLoading(false);
      }
    };

    void init();

    return () => {
      if (stopWatcher) stopWatcher();
      keycloak.onTokenExpired = undefined;
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthRefreshSuccess = undefined;
      keycloak.onAuthLogout = undefined;
    };
  }, [handleLogin, syncAuthState, setAuth, setInitializedZustand]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      loading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [isAuthenticated, token, loading, handleLogin, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
