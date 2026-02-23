import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@libs/query';
import type { ApiResponse } from '@/services/http';
import { rolesApi } from '../api';
import type { CreateRolePayload, RoleDetails, UpdateRolePayload } from '../types';

export interface UpdateRoleVariables {
  id: number | string;
  payload: UpdateRolePayload;
}

export const useRoleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<RoleDetails>, Error, CreateRolePayload>({
    mutationFn: (payload: CreateRolePayload) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<RoleDetails>, Error, UpdateRoleVariables>({
    mutationFn: ({ id, payload }) => rolesApi.update(id, payload),
    onSuccess: (_data, role) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.details() });
      // permissions may change as part of role update
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.permissionsById(role.id),
      });
    },
  });
};

export const useRoleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: (id) => rolesApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.details() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.permissionsById(id),
      });
    },
  });
};
