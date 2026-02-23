import { queryKeys } from '@libs/query';
import { useQuery } from '@tanstack/react-query';
import { rolesApi, type RolesListParams } from '../api';
import type { PermissionNode, Role, RoleDetails } from '../types';



export const useRoles = (params: RolesListParams = {}) => {
  return useQuery<Array<Role>, Error>({
    queryKey: queryKeys.roles.list(params),
    queryFn: () => rolesApi.getList(params).then((res) => {
      if (!res.success) throw new Error(res.error?.message || 'Failed to fetch roles');

      return res.data;
    }),
  });
};


export const useRoleDetail = (id: number | string | undefined) => {
  return useQuery<RoleDetails, Error>({
    queryKey: queryKeys.roles.detail?.(id as number) ?? ['roles', 'detail', id],
    queryFn: () => {
      if (id === undefined || id === null) {
        return Promise.reject(new Error('Role id is required'));
      }
      return rolesApi.getById(id).then((res) => {
        if (!res.success) throw new Error(res.error?.message || 'Failed to fetch role details');
        
        return res.data;
      });
    },
    enabled: id !== undefined && id !== null,
  });
};

export const usePermissions = (params: RolesListParams = {}) => {
  return useQuery<Array<PermissionNode>, Error>({
    queryKey: [...queryKeys.roles.permissions(), { params }],
    queryFn: () => rolesApi.getAllPermissions(params).then((res) => {
      if (!res.success) throw new Error(res.error?.message || 'Failed to fetch permissions');

      return res.data;
    }),
  });
};


export const usePermissionsById = (
  roleId: number | string | undefined,
  params: RolesListParams = {},
) => {
  return useQuery<Array<PermissionNode>, Error>({
    queryKey:
      roleId == null
        ? [...queryKeys.roles.all, 'permissions', { roleId, params }]
        : [...queryKeys.roles.permissionsById(roleId), { params }],
    queryFn: () => {
      if (roleId === undefined) return Promise.resolve([]);
      return rolesApi.getPermissions(roleId, params).then((res) => {
        if (!res.success) throw new Error(res.error?.message || 'Failed to fetch role permissions');

        return res.data;
      });
    },
    enabled: roleId !== undefined && roleId !== null,
  });
};

