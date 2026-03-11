import type { PermissionNode, User } from '@libs/types';
import { http, type ApiSuccessResponse } from '@services/http';
import { AUTH_ENDPOINTS } from './auth.endpoint';

export interface PaginationParams {
  page?: number;
  size?: number;
}

export const authService = {
  async getMe(): Promise<ApiSuccessResponse<User>> {
    return await http.get<User>(AUTH_ENDPOINTS.ME);
  },

  async getPermissions(
    roleId: number | string,
    params?: PaginationParams,
  ): Promise<ApiSuccessResponse<Array<PermissionNode>>> {
    return await http.get<Array<PermissionNode>>(
      AUTH_ENDPOINTS.PERMISSIONS(roleId),
      {
        params,
      },
    );
  },
};
