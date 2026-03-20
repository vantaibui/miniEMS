import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@libs/hooks';
import { queryKeys, useAppMutation } from '@libs/query';

import { resolveSuccessMessage, type ApiSuccessResponse } from '@services/http';

import { rolesApi } from '../api';

import type {
  CreateRolePayload,
  RoleDetails,
  UpdateRolePayload,
} from '../types';

export interface UpdateRoleVariables {
  id: number | string;
  payload: UpdateRolePayload;
}

export const useRoleCreate = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<RoleDetails>, CreateRolePayload>({
    mutationFn: (payload) => rolesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      toast.success(resolveSuccessMessage(res.message, 'create'));
    },
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<RoleDetails>, UpdateRoleVariables>({
    mutationFn: ({ id, payload }) => rolesApi.update(id, payload),
    onSuccess: (res, role) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.details() });
      // permissions may change as part of role update
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.permissionsById(role.id),
      });
      toast.success(resolveSuccessMessage(res.message, 'update'));
    },
  });
};

export const useRoleDelete = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<void>, number | string>({
    mutationFn: (id) => rolesApi.delete(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.details() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.permissionsById(id),
      });
      toast.success(resolveSuccessMessage(res.message, 'delete'));
    },
  });
};
