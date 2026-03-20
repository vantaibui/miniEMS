import {
  PERMISSION_ACTIONS,
  PERMISSION_SUBMODULES,
  usePermission,
} from '@modules/auth';

import { useUserPermissions } from '../useUserPermissions';

jest.mock('@modules/auth', () => ({
  PERMISSION_ACTIONS: {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
  },
  PERMISSION_SUBMODULES: {
    USER_MANAGEMENT: 'USER_MANAGEMENT',
  },
  usePermission: jest.fn(),
}));

const mockedUsePermission = usePermission as unknown as jest.Mock;

describe('useUserPermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps CRUD permissions from auth hook', () => {
    mockedUsePermission
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const result = useUserPermissions();

    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      1,
      PERMISSION_SUBMODULES.USER_MANAGEMENT,
      PERMISSION_ACTIONS.READ,
    );
    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      2,
      PERMISSION_SUBMODULES.USER_MANAGEMENT,
      PERMISSION_ACTIONS.CREATE,
    );
    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      3,
      PERMISSION_SUBMODULES.USER_MANAGEMENT,
      PERMISSION_ACTIONS.UPDATE,
    );
    expect(mockedUsePermission).toHaveBeenNthCalledWith(
      4,
      PERMISSION_SUBMODULES.USER_MANAGEMENT,
      PERMISSION_ACTIONS.DELETE,
    );

    expect(result).toEqual({
      canView: true,
      canCreate: false,
      canEdit: true,
      canDelete: false,
    });
  });
});
