import { http } from './http.client';

export interface CrudEndpoints {
  base: string;
}

export const createCRUD = <
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
>(
  endpoints: CrudEndpoints,
) => ({
  getList: (params?: Record<string, unknown>) =>
    http.get<Array<TEntity>>(endpoints.base, { params }),

  getById: (id: number | string) =>
    http.get<TEntity>(`${endpoints.base}/${id}`),

  create: (payload: TCreateDto) =>
    http.post<TEntity, TCreateDto>(endpoints.base, payload),

  update: (id: number | string, payload: TUpdateDto) =>
    http.put<TEntity, TUpdateDto>(`${endpoints.base}/${id}`, payload),

  delete: (id: number | string) => http.delete<void>(`${endpoints.base}/${id}`),
});

export type CrudApi<TEntity, TCreate, TUpdate> = ReturnType<
  typeof createCRUD<TEntity, TCreate, TUpdate>
>;
