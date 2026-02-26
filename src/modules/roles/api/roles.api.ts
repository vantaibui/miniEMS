import { createResourceApi, http, type ApiSuccessResponse } from '@services/http';

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
  async getList(params?: RolesListParams): Promise<ApiSuccessResponse<Array<Role>>> {
    return await http.get<Array<Role>>(
      ROLES_ENDPOINTS.LIST,
      { params: params as Record<string, unknown> }
    ) as ApiSuccessResponse<Array<Role>>;
  },

  async getById(id: number | string): Promise<ApiSuccessResponse<RoleDetails>> {
    return await crud.getById(id) as ApiSuccessResponse<RoleDetails>;
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
    ) as ApiSuccessResponse<Array<PermissionNode>>;
  },

  async getAllPermissions(
    params?: RolesListParams,
  ): Promise<ApiSuccessResponse<Array<PermissionNode>>> {
    return await http.get<Array<PermissionNode>>(
      ROLES_ENDPOINTS.ALL_PERMISSIONS,
      { params: params as Record<string, unknown> }
    ) as ApiSuccessResponse<Array<PermissionNode>>;
  },

  async create(payload: CreateRolePayload): Promise<ApiSuccessResponse<RoleDetails>> {
    return await crud.create(payload) as ApiSuccessResponse<RoleDetails>;
  },

  async update(
    id: number | string,
    payload: UpdateRolePayload,
  ): Promise<ApiSuccessResponse<RoleDetails>> {
    return await crud.update(id, payload) as ApiSuccessResponse<RoleDetails>;
  },

  async delete(id: number | string): Promise<ApiSuccessResponse<void>> {
    return await (crud.delete(id) as unknown as Promise<ApiSuccessResponse<void>>);
  },
};
