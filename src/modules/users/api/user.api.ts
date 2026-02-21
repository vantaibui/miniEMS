import http from '@services/http/httpClient';
import type { UserMe } from '@libs/types';

export const userService = {
  getMe: async (): Promise<UserMe> => {
    return http.get<UserMe>('/v1/users/me');
  },
};
