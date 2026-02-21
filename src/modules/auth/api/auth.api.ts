import type { PermissionNode, UserMe } from '@libs/types';
import http from '@services/http/httpClient';

export const authService = {
  getMe: async (): Promise<UserMe> => {
    return http.get<UserMe>('/v1/users/me');
  },

  getPermissions: async (roleId: number): Promise<Array<PermissionNode>> => {
    return http.get<Array<PermissionNode>>(`/v1/roles/${roleId}/permissions`);
  },
};
