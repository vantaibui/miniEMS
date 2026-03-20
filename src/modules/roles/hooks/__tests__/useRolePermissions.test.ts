import {
  PERMISSION_ACTIONS,
  PERMISSION_SUBMODULES,
  usePermission,
} from '@modules/auth';

import { useRolePermissions } from '../useRolePermissions';

jest.mock('@modules/auth', () => ({
  PERMISSION_ACTIONS: {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
  },
  PERMISSION_SUBMODULES: {
    ROLE_MANAGEMENT: 'ROLE_MANAGEMENT',
  },
  usePermission: jest.fn(),
}));

const mockedUsePermission = usePermission as unknown as jest.Mock;

describe('useRolePermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps CRUD permissions from auth hook', () => {
    mockedUsePermission
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const result = useRolePermissions();

    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      1,
      PERMISSION_SUBMODULES.ROLE_MANAGEMENT,
      PERMISSION_ACTIONS.READ,
    );
    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      2,
      PERMISSION_SUBMODULES.ROLE_MANAGEMENT,
      PERMISSION_ACTIONS.CREATE,
    );
    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      3,
      PERMISSION_SUBMODULES.ROLE_MANAGEMENT,
      PERMISSION_ACTIONS.UPDATE,
    );
    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      4,
      PERMISSION_SUBMODULES.ROLE_MANAGEMENT,
      PERMISSION_ACTIONS.DELETE,
    );

    expect(result).toEqual({
      canView: false,
      canCreate: true,
      canEdit: false,
      canDelete: true,
    });
  });
});
