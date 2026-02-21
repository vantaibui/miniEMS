import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { TokenPayload, UserProfile } from '@libs/types';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { initKeycloak, keycloak, login, logout, refreshToken, startSessionWatcher } from '../api/keycloak';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitializedZustand = useAuthStore((s) => s.setInitialized);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const isInitialized = useRef(false);

  const syncAuthState = useCallback(() => {
    const authenticated = !!keycloak.authenticated;
    setIsAuthenticated(authenticated);
    setToken(keycloak.token || null);

    if (authenticated && keycloak.tokenParsed) {
      const profile = keycloak.tokenParsed as TokenPayload;

      const userProfile: UserProfile = {
        id: profile.sub,
        username: profile.preferred_username,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        fullName: profile.name,
        roles: profile.realm_access?.roles || keycloak.realmAccess?.roles || [],
      };

      setUser(userProfile);

      // Sync to Zustand (used by ProtectedRoute)
      setAuth({
        isAuthenticated: true,
        token: keycloak.token,
        refreshToken: keycloak.refreshToken,
        userProfile,
      });
    } else {
      setUser(null);

      // Sync to Zustand
      setAuth({
        isAuthenticated: false,
        token: undefined,
        refreshToken: undefined,
        userProfile: null,
      });
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

    // 1. Set up handlers BEFORE init to catch early events
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
      setUser(null);

      // Sync to Zustand
      setAuth({
        isAuthenticated: false,
        token: undefined,
        refreshToken: undefined,
        userProfile: null,
      });
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
        setInitializedZustand(true); // Unblock ProtectedRoute
        setLoading(false);
      }
    };

    init();

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
      user,
      token,
      loading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [isAuthenticated, user, token, loading, handleLogin, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
