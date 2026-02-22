export const ROLES_ENDPOINTS = {
  LIST: '/v1/roles',
  DETAIL: (id: number | string) => `/v1/roles/${id}`,
  PERMISSIONS: (id: number | string) => `/v1/roles/${id}/permissions`,
  ALL_PERMISSIONS: '/v1/permissions',
} as const;
