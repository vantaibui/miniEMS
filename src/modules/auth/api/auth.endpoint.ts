export const AUTH_ENDPOINTS = {
  ME: '/v1/users/me',
  PERMISSIONS: (id: number | string) => `/v1/roles/${id}/permissions`,
} as const;
