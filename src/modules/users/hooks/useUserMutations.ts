import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/libs/query';
import type { ApiResponse } from '@/services/http';
import { usersApi } from '../api';
import type { CreateUserPayload, User } from '../types';
import type { UpdateUserPayload } from '../types';

export interface UpdateUserVariables {
  id: number | string;
  payload: UpdateUserPayload;
}

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<User>, Error, CreateUserPayload>({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<User>, Error, UpdateUserVariables>({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: (_data, user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(user.id),
      });
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
};
