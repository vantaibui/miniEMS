import { http, createCRUD } from '@services/http';

import { USERS_ENDPOINTS } from './users.endpoints';
import {
  mapUserDtoToEntity,
  mapUserEntityToCreateDto,
  mapUserEntityToUpdateDto,
} from './users.mapper';
import type { UserDto } from '../types/user.dto';
import type { UserEntity } from '../types/user.entity';
import type {
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user.payload';

const crud = createCRUD<
  UserDto,
  ReturnType<typeof mapUserEntityToCreateDto>,
  ReturnType<typeof mapUserEntityToUpdateDto>
>({
  base: USERS_ENDPOINTS.LIST,
});

export const usersApi = {
  async getList(): Promise<Array<UserEntity>> {
    const dtos = await crud.getList();
    return dtos.map(mapUserDtoToEntity);
  },

  async getById(id: number | string): Promise<UserEntity> {
    const dto = await crud.getById(id);
    return mapUserDtoToEntity(dto);
  },

  async create(payload: CreateUserPayload): Promise<UserEntity> {
    const dto = await crud.create(mapUserEntityToCreateDto(payload));
    return mapUserDtoToEntity(dto);
  },

  async update(
    id: number | string,
    payload: UpdateUserPayload,
  ): Promise<UserEntity> {
    const dto = await crud.update(id, mapUserEntityToUpdateDto(payload));
    return mapUserDtoToEntity(dto);
  },

  async delete(id: number | string): Promise<void> {
    return crud.delete(id);
  },

  async getMe(): Promise<UserEntity> {
    const dto = await http.get<UserDto>(USERS_ENDPOINTS.ME);
    return mapUserDtoToEntity(dto);
  },

  async activate(id: number | string): Promise<void> {
    await http.post<void>(USERS_ENDPOINTS.ACTIVATE(id));
  },

  async deactivate(id: number | string): Promise<void> {
    await http.post<void>(USERS_ENDPOINTS.DEACTIVATE(id));
  },
};
