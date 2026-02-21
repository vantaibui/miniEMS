/**
 * Standardized Query Key Factory
 * 
 * This follows the pattern: [domain, scope, ...params]
 * 
 * Benefits:
 * 1. Type safety for query keys
 * 2. Easy invalidation by domain or scope
 * 3. Centralized key management
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.users.lists(), { params }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.users.details(), id] as const,
  },
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.roles.lists(), { params }] as const,
  },
  device: {
    all: ['device'] as const,
    lists: () => [...queryKeys.device.all, 'list'] as const,
    list: (params: unknown) => [...queryKeys.device.lists(), { params }] as const,
    status: () => [...queryKeys.device.all, 'status'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    metrics: (period: string) => [...queryKeys.dashboard.all, 'metrics', period] as const,
  },
};
