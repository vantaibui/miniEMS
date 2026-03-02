import { createResourceApi, http, type ApiSuccessResponse } from '@services/http';

import { USERS_ENDPOINTS } from './users.endpoints';

import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '../types';

const crud = createResourceApi<
  User,
  CreateUserPayload,
  UpdateUserPayload
>({
  base: USERS_ENDPOINTS.LIST,
});

export interface UsersListParams {
  page?: number;
  size?: number;
  [key: string]: unknown;
}

export const usersApi = {
  async getList(params?: UsersListParams): Promise<ApiSuccessResponse<Array<User>>> {
    return await crud.getList(params as Record<string, unknown>);
  },

  async getById(id: number | string): Promise<ApiSuccessResponse<User>> {
    return await crud.getById(id);
  },

  async create(payload: CreateUserPayload): Promise<ApiSuccessResponse<User>> {
    return await crud.create(payload);
  },

  async update(
    id: number | string,
    payload: UpdateUserPayload,
  ): Promise<ApiSuccessResponse<User>> {
    return await crud.update(id, payload);
  },

  async delete(id: number | string): Promise<ApiSuccessResponse<void>> {
    return await crud.delete(id);
  },

  async getMe(): Promise<ApiSuccessResponse<User>> {
    return await http.get<User>(USERS_ENDPOINTS.ME);
  },
};
