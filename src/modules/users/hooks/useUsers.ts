import { useQuery } from '@tanstack/react-query';

import { usersApi } from '../api';
import type { UserEntity } from '../types';

const USERS_QUERY_KEY = ['users'];

export const useUsers = () => {
  return useQuery<Array<UserEntity>, Error>({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => usersApi.getList(),
  });
};
