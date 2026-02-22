import { usersApi } from './users.api';

/**
 * Backward-compatible facade.
 * Prefer importing `usersApi` from `@modules/users`.
 */
export const userService = {
  getMe: () => usersApi.getMe(),
};
