import { http } from './httpClient';

/**
 * Generic CRUD helper factory to standardize API modules.
 * @param resource The base resource path (e.g., '/users')
 */
export const createCrudApi = <TEntity, TCreateDto = Partial<TEntity>, TUpdateDto = Partial<TEntity>>(resource: string) => {
  return {
    /**
     * Get a list of entities.
     * @param params Optional query parameters
     */
    getAll: (params?: Record<string, unknown>): Promise<TEntity[]> => {
      return http.get<TEntity[]>(resource, { params });
    },

    /**
     * Get a single entity by ID.
     * @param id The entity ID
     */
    getById: (id: string | number): Promise<TEntity> => {
      return http.get<TEntity>(`${resource}/${id}`);
    },

    /**
     * Create a new entity.
     * @param data The payload for creation
     */
    create: (data: TCreateDto): Promise<TEntity> => {
      return http.post<TEntity>(resource, data);
    },

    /**
     * Update an entity by ID.
     * @param id The entity ID
     * @param data The payload for update
     */
    update: (id: string | number, data: TUpdateDto): Promise<TEntity> => {
      return http.put<TEntity>(`${resource}/${id}`, data);
    },

    /**
     * Delete an entity by ID.
     * @param id The entity ID
     */
    delete: (id: string | number): Promise<void> => {
      return http.delete<void>(`${resource}/${id}`);
    },
  };
};
