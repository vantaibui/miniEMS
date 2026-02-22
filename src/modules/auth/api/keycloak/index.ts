import { keycloak, initKeycloak } from './client';
import {
  refreshToken,
  startSessionWatcher,
  getToken,
  isAuthenticated,
} from './tokenManager';

export {
  keycloak,
  initKeycloak,
  refreshToken,
  startSessionWatcher,
  getToken,
  isAuthenticated,
};

export const login = (redirectUri: string = window.location.href) =>
  keycloak.login({ redirectUri });

export const logout = (redirectUri: string = window.location.origin) =>
  keycloak.logout({ redirectUri });
