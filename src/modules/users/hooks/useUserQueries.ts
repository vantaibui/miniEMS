import { queryKeys } from '@libs/query';
import { useQuery } from '@tanstack/react-query';
import { usersApi, type UsersListParams } from '../api';
import type { User } from '../types';

export const useUsers = (params: UsersListParams = {}) => {
  return useQuery<Array<User>, Error>({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getList(params).then((res) => {
      if (!res.success) throw new Error(res.error?.message || 'Failed to fetch users');

      return res.data;
    }),
  });
};

export const useUserDetail = (id: number | string, enabled = true) => {
  return useQuery<User, Error>({
    queryKey: queryKeys.users.detail(id) ?? ['users', 'detail', id],
    queryFn: () => usersApi.getById(id).then((res) => {
      if (!res.success) throw new Error(res.error?.message || 'Failed to fetch user');

      return res.data;
    }),
    enabled,
  });
};
