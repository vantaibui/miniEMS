import { rolesApi } from '../../api';
import {
  usePermissions,
  usePermissionsById,
  useRoleDetail,
  useRoles,
} from '../useRoleQueries';

jest.mock('@libs/query', () => ({
  useAppQuery: jest.fn(),
}));

jest.mock('../../api', () => ({
  rolesApi: {
    getList: jest.fn(),
    getById: jest.fn(),
    getAllPermissions: jest.fn(),
    getPermissions: jest.fn(),
  },
}));

const mockedQueryModule = jest.requireMock('@libs/query') as {
  useAppQuery: jest.Mock;
};

const mockedUseAppQuery = mockedQueryModule.useAppQuery;
const mockedRolesApi = rolesApi as unknown as {
  getList: jest.Mock;
  getById: jest.Mock;
  getAllPermissions: jest.Mock;
  getPermissions: jest.Mock;
};

describe('useRoleQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds roles list query and maps response', async () => {
    const params = { page: 1, size: 20 };
    mockedRolesApi.getList.mockResolvedValue({ data: [] });

    useRoles(params);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['roles', 'list', params]);

    await options.queryFn();
    expect(mockedRolesApi.getList).toHaveBeenCalledWith(params);

    const response = {
      data: [{ id: 1 }],
      meta: { pagination: { page: 1, size: 20 } },
    };
    expect(options.select(response)).toEqual({
      items: response.data,
      pagination: response.meta.pagination,
    });
  });

  it('builds role detail query with enabled=true when id exists', async () => {
    mockedRolesApi.getById.mockResolvedValue({ data: { id: 2 } });

    useRoleDetail(2);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['roles', 'detail', 2]);
    expect(options.enabled).toBe(true);

    await options.queryFn();
    expect(mockedRolesApi.getById).toHaveBeenCalledWith(2);

    const response = { data: { id: 2, name: 'Admin' } };
    expect(options.select(response)).toEqual(response.data);
  });

  it('builds role detail query with enabled=false and throws when id is missing', () => {
    useRoleDetail(undefined);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['roles', 'detail', undefined]);
    expect(options.enabled).toBe(false);
    expect(() => options.queryFn()).toThrow('Role id is required');
  });

  it('builds permissions query and normalizes actions to false', async () => {
    const params = { size: 50 };
    mockedRolesApi.getAllPermissions.mockResolvedValue({ data: [] });

    usePermissions(params);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['roles', 'permissions', params]);

    await options.queryFn();
    expect(mockedRolesApi.getAllPermissions).toHaveBeenCalledWith(params);

    const response = {
      data: [
        {
          id: 11,
          name: 'User Management',
          module: 'USER',
          subModule: 'USER_MANAGEMENT',
          actions: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      ],
      meta: { pagination: { page: 0, size: 50 } },
    };

    expect(options.select(response)).toEqual({
      items: [
        {
          ...response.data[0],
          actions: {
            create: false,
            read: false,
            update: false,
            delete: false,
          },
        },
      ],
      pagination: response.meta.pagination,
    });
  });

  it('builds permissions-by-id query and maps response', async () => {
    const params = { page: 0, size: 10 };
    mockedRolesApi.getPermissions.mockResolvedValue({ data: [] });

    usePermissionsById(9, params);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['roles', 'permissions', 9, params]);
    expect(options.enabled).toBe(true);

    await options.queryFn();
    expect(mockedRolesApi.getPermissions).toHaveBeenCalledWith(9, params);

    const response = {
      data: [{ id: 22 }],
      meta: { pagination: { page: 0, size: 10 } },
    };
    expect(options.select(response)).toEqual({
      items: response.data,
      pagination: response.meta.pagination,
    });
  });

  it('disables permissions-by-id query and throws when roleId is missing', () => {
    usePermissionsById(undefined, {});

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['roles', 'permissions', undefined, {}]);
    expect(options.enabled).toBe(false);
    expect(() => options.queryFn()).toThrow('Role id is required');
  });
});
