import { createCRUD, http } from '@services/http';

import type {
  CreateRolePayload,
  PermissionNodeDto,
  PermissionNode,
  RoleDetailDto,
  RoleDetailEntity,
  RoleDto,
  RoleEntity,
  UpdateRolePayload,
} from '../types';

import { ROLES_ENDPOINTS } from './roles.endpoints';
import {
  mapCreateRolePayloadToDto,
  mapPermissionNodeDtoToEntity,
  mapRoleDetailDtoToEntity,
  mapRoleDtoToEntity,
  mapUpdateRolePayloadToDto,
} from './roles.mapper';

const crud = createCRUD<
  RoleDto,
  ReturnType<typeof mapCreateRolePayloadToDto>,
  ReturnType<typeof mapUpdateRolePayloadToDto>
>({
  base: ROLES_ENDPOINTS.LIST,
});

export interface RolesListParams {
  page?: number;
  size?: number;
}

export const rolesApi = {
  async getList(params?: RolesListParams): Promise<Array<RoleEntity>> {
    const responseData = await crud.getList(
      params as Record<string, unknown> | undefined,
    );
    return responseData.map(mapRoleDtoToEntity);
  },

  async getById(id: number | string): Promise<RoleEntity> {
    const responseData = await crud.getById(id);
    return mapRoleDtoToEntity(responseData);
  },

  async getPermissions(
    roleId: number | string,
    params?: RolesListParams,
  ): Promise<Array<PermissionNode>> {
    const responseData = await http.get<Array<PermissionNodeDto>>(
      ROLES_ENDPOINTS.PERMISSIONS(roleId),
      {
        params,
      },
    );
    return responseData.map(mapPermissionNodeDtoToEntity);
  },

  async getAllPermissions(
    params?: RolesListParams,
  ): Promise<Array<PermissionNode>> {
    const responseData = await http.get<Array<PermissionNodeDto>>(
      ROLES_ENDPOINTS.ALL_PERMISSIONS,
      {
        params,
      },
    );
    return responseData.map(mapPermissionNodeDtoToEntity);
  },

  async create(payload: CreateRolePayload): Promise<RoleDetailEntity> {
    const responseData = await http.post<
      RoleDetailDto,
      ReturnType<typeof mapCreateRolePayloadToDto>
    >(ROLES_ENDPOINTS.LIST, mapCreateRolePayloadToDto(payload));
    return mapRoleDetailDtoToEntity(responseData);
  },

  async update(
    id: number | string,
    payload: UpdateRolePayload,
  ): Promise<RoleDetailEntity> {
    const responseData = await http.put<
      RoleDetailDto,
      ReturnType<typeof mapUpdateRolePayloadToDto>
    >(ROLES_ENDPOINTS.DETAIL(id), mapUpdateRolePayloadToDto(payload));
    return mapRoleDetailDtoToEntity(responseData);
  },

  /**
   * Soft delete on backend: sets status to INACTIVE and removes role_permissions mappings.
   */
  async delete(id: number | string): Promise<void> {
    await http.delete<void>(ROLES_ENDPOINTS.DETAIL(id));
  },
};
