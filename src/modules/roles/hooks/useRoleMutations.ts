import { useQueryClient } from '@tanstack/react-query';

import { queryKeys, useAppMutation } from '@libs/query';
import type { ApiSuccessResponse } from '@services/http';

import { rolesApi } from '../api';
import type { CreateRolePayload, RoleDetails, UpdateRolePayload } from '../types';

export interface UpdateRoleVariables {
  id: number | string;
  payload: UpdateRolePayload;
}

export const useRoleCreate = () => {
  const queryClient = useQueryClient();

  return useAppMutation<ApiSuccessResponse<RoleDetails>, CreateRolePayload>({
    mutationFn: (payload) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();

  return useAppMutation<ApiSuccessResponse<RoleDetails>, UpdateRoleVariables>({
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

  return useAppMutation<ApiSuccessResponse<void>, number | string>({
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
