import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { usersApi } from '../api';
import type { UserEntity, UpdateUserPayload } from '../types';

export interface UpdateUserVariables {
  id: number | string;
  payload: UpdateUserPayload;
}

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<UserEntity, Error, UpdateUserVariables>({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.id),
      });
    },
  });
};
