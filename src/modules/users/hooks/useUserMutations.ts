import { useQueryClient } from '@tanstack/react-query';

import { queryKeys, useAppMutation } from '@/libs/query';
import { resolveSuccessMessage, type ApiSuccessResponse } from '@/services/http';
import { useToast } from '@libs/hooks';
import { usersApi } from '../api';
import type { CreateUserPayload, User, UpdateUserPayload } from '../types';

export interface UpdateUserVariables {
  id: number | string;
  payload: UpdateUserPayload;
}

export const useUserCreate = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<User>, CreateUserPayload>({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      toast.success(resolveSuccessMessage(res.message, 'create'));
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<User>, UpdateUserVariables>({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
      toast.success(resolveSuccessMessage(res.message, 'update'));
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<void>, number | string>({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      toast.success(resolveSuccessMessage(res.message, 'delete'));
    },
  });
};
