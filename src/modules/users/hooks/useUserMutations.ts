import { useQueryClient } from '@tanstack/react-query';

import { queryKeys, useAppMutation } from '@/libs/query';
import type { ApiResponse } from '@/services/http';
import { usersApi } from '../api';
import type { CreateUserPayload, User, UpdateUserPayload } from '../types';

export interface UpdateUserVariables {
  id: number | string;
  payload: UpdateUserPayload;
}

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  return useAppMutation<ApiResponse<User>, CreateUserPayload>({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useAppMutation<ApiResponse<User>, UpdateUserVariables>({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useAppMutation<void, number | string>({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
};
