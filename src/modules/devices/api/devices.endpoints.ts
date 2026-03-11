export const DEVICES_ENDPOINTS = {
  LIST: '/v1/devices',
  DETAIL: (id: number | string) => `/v1/devices/${id}`,
  PROTOCOLS: '/v1/protocols',
  TEST_CONNECTION: '/v1/devices/test-connection',
} as const;
