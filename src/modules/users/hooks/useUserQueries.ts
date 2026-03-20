import { queryKeys, useAppQuery } from '@libs/query';

import { usersApi, type UsersListParams } from '../api';

import type { User } from '../types';
import type { ApiSuccessResponse, PaginationResult } from '@/services/http';

export type ListResult<T> = {
  items: Array<T>;
  pagination?: PaginationResult;
};

export const useUsers = (params: UsersListParams = {}) => {
  return useAppQuery<ApiSuccessResponse<Array<User>>, ListResult<User>>({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getList(params),
    select: (response) => ({
      items: response?.data ?? [],
      pagination: response?.meta?.pagination,
    }),
  });
};

export const useUserDetail = (id: number | string, enabled = true) => {
  return useAppQuery<ApiSuccessResponse<User>, User>({
    queryKey: ['users', 'detail', id],
    queryFn: () => usersApi.getById(id),
    select: (response) => response.data,
    enabled,
  });
};
