import { authService } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { useAuthMe, useAuthPermissions } from '../useAuthQueries';

jest.mock('@libs/query', () => ({
  queryKeys: {
    auth: {
      all: ['auth'],
      me: () => ['auth', 'me'],
    },
  },
  useAppQuery: jest.fn(),
}));

jest.mock('../../api/auth.api', () => ({
  authService: {
    getMe: jest.fn(),
    getPermissions: jest.fn(),
  },
}));

jest.mock('../../store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

const mockedUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockedAuthService = authService as unknown as {
  getMe: jest.Mock;
  getPermissions: jest.Mock;
};
const mockedQueryModule = jest.requireMock('@libs/query') as {
  queryKeys: {
    auth: {
      all: Array<string>;
      me: () => Array<string>;
    };
  };
  useAppQuery: jest.Mock;
};
const { queryKeys } = mockedQueryModule;
const mockedUseAppQuery = mockedQueryModule.useAppQuery;

describe('useAuthQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds useAuthMe query with enabled=true when authenticated', async () => {
    mockedUseAuthStore.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: true }),
    );
    mockedAuthService.getMe.mockResolvedValue({ data: { id: 1 } });

    useAuthMe();

    expect(mockedUseAppQuery).toHaveBeenCalledTimes(1);
    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(queryKeys.auth.me());
    expect(options.enabled).toBe(true);

    await options.queryFn();
    expect(mockedAuthService.getMe).toHaveBeenCalledTimes(1);
  });

  it('builds useAuthMe query with enabled=false when not authenticated', () => {
    mockedUseAuthStore.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: false }),
    );

    useAuthMe();

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.enabled).toBe(false);
  });

  it('builds permissions query for role and calls API', async () => {
    mockedUseAuthStore.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: true }),
    );
    mockedAuthService.getPermissions.mockResolvedValue({ data: [] });

    useAuthPermissions(7, { page: 1, size: 20 });

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual([...queryKeys.auth.all, 'permissions', 7]);
    expect(options.enabled).toBe(true);

    await options.queryFn();
    expect(mockedAuthService.getPermissions).toHaveBeenCalledWith(7, {
      page: 1,
      size: 20,
    });
  });

  it('disables permissions query when role id is missing', () => {
    mockedUseAuthStore.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: true }),
    );

    useAuthPermissions(undefined);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual([...queryKeys.auth.all, 'permissions']);
    expect(options.enabled).toBe(false);
    expect(() => options.queryFn()).toThrow(
      'Role id is required to fetch permissions',
    );
  });

  it('disables permissions query when user is not authenticated', () => {
    mockedUseAuthStore.mockImplementation(
      (selector: (state: { isAuthenticated: boolean }) => boolean) =>
        selector({ isAuthenticated: false }),
    );

    useAuthPermissions(99);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.enabled).toBe(false);
  });
});
