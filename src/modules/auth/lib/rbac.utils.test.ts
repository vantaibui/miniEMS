import { hasPermission } from './rbac.utils';
import { PERMISSION_ACTIONS } from '../constants/permissions.constants';

import type { PermissionNode } from '../../../libs/types/permission.types';

const buildPermissionNode = (
  overrides?: Partial<PermissionNode>,
): PermissionNode => ({
  id: 1,
  name: 'User Management',
  module: 'USER',
  subModule: 'USER_MANAGEMENT',
  actions: {
    create: true,
    read: true,
    update: false,
    delete: false,
  },
  ...overrides,
});

describe('hasPermission', () => {
  it('returns false when permissions is null', () => {
    expect(
      hasPermission(null, 'USER_MANAGEMENT', PERMISSION_ACTIONS.READ),
    ).toBe(false);
  });

  it('returns false when subModule is not found', () => {
    const permissions: Array<PermissionNode> = [buildPermissionNode()];

    expect(
      hasPermission(permissions, 'ROLE_MANAGEMENT', PERMISSION_ACTIONS.READ),
    ).toBe(false);
  });

  it('returns action permission when action exists', () => {
    const permissions: Array<PermissionNode> = [buildPermissionNode()];

    expect(
      hasPermission(permissions, 'USER_MANAGEMENT', PERMISSION_ACTIONS.CREATE),
    ).toBe(true);
    expect(
      hasPermission(permissions, 'USER_MANAGEMENT', PERMISSION_ACTIONS.UPDATE),
    ).toBe(false);
  });

  it('falls back to read when action key is not present', () => {
    const permissions: Array<PermissionNode> = [buildPermissionNode()];

    expect(
      hasPermission(
        permissions,
        'USER_MANAGEMENT',
        'export' as unknown as (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS],
      ),
    ).toBe(true);
  });

  it('returns false when read is false and action key is unknown', () => {
    const permissions: Array<PermissionNode> = [
      buildPermissionNode({
        actions: {
          create: true,
          read: false,
          update: false,
          delete: false,
        },
      }),
    ];

    expect(
      hasPermission(
        permissions,
        'USER_MANAGEMENT',
        'export' as unknown as (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS],
      ),
    ).toBe(false);
  });
});
