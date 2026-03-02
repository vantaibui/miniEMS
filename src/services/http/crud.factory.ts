import { http } from './http.client';

export interface Endpoints {
  base: string;
}

export const createResourceApi = <
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
>(
  endpoints: Endpoints,
) => ({
  getList: (params?: Record<string, unknown>) =>
    http.get<Array<TEntity>>(endpoints.base, { params }),

  getById: (id: number | string) =>
    http.get<TEntity>(`${endpoints.base}/${id}`),

  create: (payload: TCreateDto) =>
    http.post<TEntity>(endpoints.base, payload),

  update: (id: number | string, payload: TUpdateDto) =>
    http.put<TEntity>(`${endpoints.base}/${id}`, payload),

  delete: (id: number | string) => http.delete<void>(`${endpoints.base}/${id}`),
});

export type ResourceApi<TEntity, TCreate, TUpdate> = ReturnType<
  typeof createResourceApi<TEntity, TCreate, TUpdate>
>;
