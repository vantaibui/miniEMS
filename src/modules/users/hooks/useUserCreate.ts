import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersApi } from '../api';
import type { UserEntity } from '../types';
import type { CreateUserPayload } from '../types';

const USERS_QUERY_KEY = ['users'];

export const useUserCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<UserEntity, Error, CreateUserPayload>({
    mutationFn: (payload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};
