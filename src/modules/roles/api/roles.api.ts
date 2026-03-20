import {
  createResourceApi,
  http,
  type ApiSuccessResponse,
} from '@services/http';

import { ROLES_ENDPOINTS } from './roles.endpoints';

import type {
  CreateRolePayload,
  PermissionNode,
  RoleDetails,
  Role,
  UpdateRolePayload,
} from '../types';

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
  async getList(
    params?: RolesListParams,
  ): Promise<ApiSuccessResponse<Array<Role>>> {
    return await http.get<Array<Role>>(ROLES_ENDPOINTS.LIST, {
      params: params as Record<string, unknown>,
    });
  },

  async getById(id: number | string): Promise<ApiSuccessResponse<RoleDetails>> {
    return await crud.getById(id);
  },

  async getPermissions(
    roleId: number | string,
    params?: RolesListParams,
  ): Promise<ApiSuccessResponse<Array<PermissionNode>>> {
    return await http.get<Array<PermissionNode>>(
      ROLES_ENDPOINTS.PERMISSIONS(roleId),
      {
        params,
      },
    );
  },

  async getAllPermissions(
    params?: RolesListParams,
  ): Promise<ApiSuccessResponse<Array<PermissionNode>>> {
    return await http.get<Array<PermissionNode>>(
      ROLES_ENDPOINTS.ALL_PERMISSIONS,
      { params: params as Record<string, unknown> },
    );
  },

  async create(
    payload: CreateRolePayload,
  ): Promise<ApiSuccessResponse<RoleDetails>> {
    return await crud.create(payload);
  },

  async update(
    id: number | string,
    payload: UpdateRolePayload,
  ): Promise<ApiSuccessResponse<RoleDetails>> {
    return await crud.update(id, payload);
  },

  async delete(id: number | string): Promise<ApiSuccessResponse<void>> {
    return await crud.delete(id);
  },
};
