import { devicesApi } from '../../api';
import { useDeviceDetail, useDevices, useProtocols } from '../useDeviceQueries';

jest.mock('@libs/query', () => ({
  queryKeys: {
    device: {
      list: (params: unknown) => ['device', 'list', params],
      protocolList: (params: unknown) => ['device', 'protocol-list', params],
      detail: (id: number | string) => ['device', 'detail', id],
    },
  },
  useAppQuery: jest.fn(),
}));

jest.mock('../../api', () => ({
  devicesApi: {
    getList: jest.fn(),
    getProtocols: jest.fn(),
    getById: jest.fn(),
  },
}));

const mockedQueryModule = jest.requireMock('@libs/query') as {
  queryKeys: {
    device: {
      list: (params: unknown) => Array<unknown>;
      protocolList: (params: unknown) => Array<unknown>;
      detail: (id: number | string) => Array<unknown>;
    };
  };
  useAppQuery: jest.Mock;
};

const { queryKeys } = mockedQueryModule;
const mockedUseAppQuery = mockedQueryModule.useAppQuery;
const mockedDevicesApi = devicesApi as unknown as {
  getList: jest.Mock;
  getProtocols: jest.Mock;
  getById: jest.Mock;
};

describe('useDeviceQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds devices query and maps list response', async () => {
    const params = { page: 0, size: 10 };
    mockedDevicesApi.getList.mockResolvedValue({ data: [] });

    useDevices(params);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(queryKeys.device.list(params));

    await options.queryFn();
    expect(mockedDevicesApi.getList).toHaveBeenCalledWith(params);

    const response = {
      data: [{ id: 1 }],
      meta: { pagination: { page: 0, size: 10 } },
    };
    expect(options.select(response)).toEqual({
      items: response.data,
      pagination: response.meta.pagination,
    });
  });

  it('builds protocol query and maps response', async () => {
    const params = { size: 50 };
    mockedDevicesApi.getProtocols.mockResolvedValue({ data: [] });

    useProtocols(params);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(queryKeys.device.protocolList(params));

    await options.queryFn();
    expect(mockedDevicesApi.getProtocols).toHaveBeenCalledWith(params);

    const response = {
      data: [{ id: 101, name: 'Modbus' }],
      meta: { pagination: { page: 0, size: 50 } },
    };
    expect(options.select(response)).toEqual({
      items: response.data,
      pagination: response.meta.pagination,
    });
  });

  it('builds detail query with enabled=true when id exists', async () => {
    mockedDevicesApi.getById.mockResolvedValue({ data: { id: 10 } });

    useDeviceDetail(10);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(queryKeys.device.detail(10));
    expect(options.enabled).toBe(true);

    await options.queryFn();
    expect(mockedDevicesApi.getById).toHaveBeenCalledWith(10);

    const response = { data: { id: 10, name: 'Edge Gateway' } };
    expect(options.select(response)).toEqual(response.data);
  });

  it('builds detail query with enabled=false and throws when id is missing', () => {
    useDeviceDetail(undefined);

    const options = mockedUseAppQuery.mock.calls[0][0];
    expect(options.queryKey).toEqual(queryKeys.device.detail(''));
    expect(options.enabled).toBe(false);
    expect(() => options.queryFn()).toThrow('Device id is required');
  });
});
