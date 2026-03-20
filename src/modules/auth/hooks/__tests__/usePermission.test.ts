import { PERMISSION_ACTIONS } from '../../constants/permissions.constants';
import { hasPermission } from '../../lib/rbac.utils';
import { useRbacStore } from '../../store/auth.store';
import { useHasAction, usePermission } from '../usePermission';

jest.mock('../../store/auth.store', () => ({
  useRbacStore: jest.fn(),
}));

jest.mock('../../lib/rbac.utils', () => ({
  hasPermission: jest.fn(),
}));

const mockedUseRbacStore = useRbacStore as unknown as jest.Mock;
const mockedHasPermission = hasPermission as unknown as jest.Mock;

describe('usePermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses READ as default action', () => {
    const permissions = [{ subModule: 'USER_MANAGEMENT' }];
    mockedUseRbacStore.mockImplementation(
      (selector: (state: { permissions: unknown }) => unknown) =>
        selector({ permissions }),
    );
    mockedHasPermission.mockReturnValue(true);

    const result = usePermission('USER_MANAGEMENT');

    expect(mockedHasPermission).toHaveBeenCalledWith(
      permissions,
      'USER_MANAGEMENT',
      PERMISSION_ACTIONS.READ,
    );
    expect(result).toBe(true);
  });

  it('passes explicit action through to permission checker', () => {
    const permissions = [{ subModule: 'USER_MANAGEMENT' }];
    mockedUseRbacStore.mockImplementation(
      (selector: (state: { permissions: unknown }) => unknown) =>
        selector({ permissions }),
    );
    mockedHasPermission.mockReturnValue(false);

    const result = usePermission('USER_MANAGEMENT', PERMISSION_ACTIONS.UPDATE);

    expect(mockedHasPermission).toHaveBeenCalledWith(
      permissions,
      'USER_MANAGEMENT',
      PERMISSION_ACTIONS.UPDATE,
    );
    expect(result).toBe(false);
  });

  it('keeps useHasAction as backward-compatible alias', () => {
    expect(useHasAction).toBe(usePermission);
  });
});
