import { createResourceApi, http, type ApiResponse } from '@services/http';

import type {
  CreateRolePayload,
  PermissionNode,
  RoleDetails,
  Role,
  UpdateRolePayload,
} from '../types';

import { ROLES_ENDPOINTS } from './roles.endpoints';

const crud = createResourceApi<
  RoleDetails,
  CreateRolePayload,
  UpdateRolePayload
>({
  base: ROLES_ENDPOINTS.LIST,
});

export interface RolesListParams {
  page?: number;
  size?: number;
}

export const rolesApi = {
  async getList(params?: RolesListParams): Promise<ApiResponse<Array<Role>>> {
    return await http.get<Array<Role>>(
      ROLES_ENDPOINTS.LIST,
      { params: params as Record<string, unknown> }
    );
  },

  async getById(id: number | string): Promise<ApiResponse<RoleDetails>> {
    return await crud.getById(id);
  },

  async getPermissions(
    roleId: number | string,
    params?: RolesListParams,
  ): Promise<ApiResponse<Array<PermissionNode>>> {
    return await http.get<Array<PermissionNode>>(
      ROLES_ENDPOINTS.PERMISSIONS(roleId),
      {
        params,
      },
    );
  },

  async getAllPermissions(
    params?: RolesListParams,
  ): Promise<ApiResponse<Array<PermissionNode>>> {
    return await http.get<Array<PermissionNode>>(
      ROLES_ENDPOINTS.ALL_PERMISSIONS,
      { params: params as Record<string, unknown> }
    );
  },

  async create(payload: CreateRolePayload): Promise<ApiResponse<RoleDetails>> {
    return await crud.create(payload);
  },

  async update(
    id: number | string,
    payload: UpdateRolePayload,
  ): Promise<ApiResponse<RoleDetails>> {
    return await crud.update(id, payload);
  },

  async delete(id: number | string): Promise<void> {
    await crud.delete(id);
  },
};
