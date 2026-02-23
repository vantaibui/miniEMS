export const USERS_ENDPOINTS = {
  LIST: '/v1/users',
  DETAIL: (id: number | string) => `/v1/users/${id}`,
  ME: '/v1/users/me',
} as const;
