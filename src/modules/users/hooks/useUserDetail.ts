import { useQuery } from '@tanstack/react-query';

import { usersApi } from '../api';
import type { UserEntity } from '../types';

const userDetailKey = (id: number | string) => ['users', id];

export const useUserDetail = (id: number | string, enabled = true) => {
  return useQuery<UserEntity, Error>({
    queryKey: userDetailKey(id),
    queryFn: () => usersApi.getById(id),
    enabled,
  });
};
