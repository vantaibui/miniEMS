export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    permissions: (roleId: number | string) =>
      [...queryKeys.auth.all, 'permissions', roleId] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: unknown) =>
      [...queryKeys.users.lists(), { params }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), id] as const,
  },
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (params: unknown) =>
      [...queryKeys.roles.lists(), { params }] as const,
    details: () => [...queryKeys.roles.all, 'detail'] as const,
    detail: (id: string | number) =>
      [...queryKeys.roles.details(), id] as const,
    permissionsById: (id: string | number) =>
      [...queryKeys.roles.all, 'permissions', id] as const,
    permissions: () => [...queryKeys.roles.all, 'all-permissions'] as const,
  },
  device: {
    all: ['device'] as const,
    lists: () => [...queryKeys.device.all, 'list'] as const,
    list: (params: unknown) =>
      [...queryKeys.device.lists(), { params }] as const,
    details: () => [...queryKeys.device.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.device.details(), id] as const,
    status: () => [...queryKeys.device.all, 'status'] as const,
    protocolLists: () => [...queryKeys.device.all, 'protocol-list'] as const,
    protocolList: (params: unknown) =>
      [...queryKeys.device.protocolLists(), { params }] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    metrics: (period: string) =>
      [...queryKeys.dashboard.all, 'metrics', period] as const,
  },
};
