import type { ApiResponse } from '@services/http';
import { createResourceApi, http } from '@services/http';

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
  async getList(params?: UsersListParams): Promise<ApiResponse<Array<User>>> {
    return await http.get<Array<User>>(
      USERS_ENDPOINTS.LIST,
      { params: params as Record<string, unknown> }
    );
  },

  async getById(id: number | string): Promise<ApiResponse<User>> {
    return await crud.getById(id);
  },

  async create(payload: CreateUserPayload): Promise<ApiResponse<User>> {
    return await crud.create(payload);
  },

  async update(
    id: number | string,
    payload: UpdateUserPayload,
  ): Promise<ApiResponse<User>> {
    return await crud.update(id, payload);
  },

  async delete(id: number | string): Promise<void> {
    await crud.delete(id);
  },


  async getMe(): Promise<ApiResponse<User>> {
    return await http.get<User>(USERS_ENDPOINTS.ME);
  },
};
