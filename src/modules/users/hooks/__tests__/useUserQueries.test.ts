import { usersApi } from '../../api';
import { useUserDetail, useUsers } from '../useUserQueries';

jest.mock('@libs/query', () => ({
  queryKeys: {
    users: {
      list: (params: unknown) => ['users', 'list', params],
    },
  },
  useAppQuery: jest.fn(),
}));

jest.mock('../../api', () => ({
  usersApi: {
    getList: jest.fn(),
    getById: jest.fn(),
  },
}));

const mockedQueryModule = jest.requireMock('@libs/query') as {
  queryKeys: {
    users: {
      list: (params: unknown) => Array<unknown>;
    };
  };
  useAppQuery: jest.Mock;
};

const { queryKeys } = mockedQueryModule;
const mockedUseAppQuery = mockedQueryModule.useAppQuery;
const mockedUsersApi = usersApi as unknown as {
  getList: jest.Mock;
  getById: jest.Mock;
};

describe('useUserQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds users list query and maps list response', async () => {
    const params = { page: 1, size: 10 };
    mockedUsersApi.getList.mockResolvedValue({ data: [] });

    useUsers(params);

    expect(mockedUseAppQuery).toHaveBeenCalledTimes(1);
    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(queryKeys.users.list(params));

    await options.queryFn();
    expect(mockedUsersApi.getList).toHaveBeenCalledWith(params);

    const response = {
      data: [{ id: 1 }],
      meta: { pagination: { page: 1, size: 10 } },
    };
    expect(options.select(response)).toEqual({
      items: response.data,
      pagination: response.meta.pagination,
    });
  });

  it('builds detail query with enabled flag and maps detail response', async () => {
    mockedUsersApi.getById.mockResolvedValue({ data: { id: 99 } });

    useUserDetail(99, false);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(['users', 'detail', 99]);
    expect(options.enabled).toBe(false);

    await options.queryFn();
    expect(mockedUsersApi.getById).toHaveBeenCalledWith(99);

    const response = { data: { id: 99, name: 'User 99' } };
    expect(options.select(response)).toEqual(response.data);
  });
});
