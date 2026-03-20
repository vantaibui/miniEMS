import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@libs/hooks';

import { resolveSuccessMessage } from '@services/http';

import { devicesApi } from '../../api';
import {
  useDeviceCreate,
  useDeviceDelete,
  useDeviceTestConnection,
  useDeviceUpdate,
} from '../useDeviceMutations';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@libs/query', () => ({
  queryKeys: {
    device: {
      lists: () => ['device', 'list'],
      detail: (id: number | string) => ['device', 'detail', id],
    },
  },
  useAppMutation: jest.fn(),
}));

jest.mock('@services/http', () => ({
  resolveSuccessMessage: jest.fn(),
}));

jest.mock('@libs/hooks', () => ({
  useToast: jest.fn(),
}));

jest.mock('../../api', () => ({
  devicesApi: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    testConnection: jest.fn(),
  },
}));

const mockedQueryModule = jest.requireMock('@libs/query') as {
  queryKeys: {
    device: {
      lists: () => Array<unknown>;
      detail: (id: number | string) => Array<unknown>;
    };
  };
  useAppMutation: jest.Mock;
};

const { queryKeys } = mockedQueryModule;
const mockedUseAppMutation = mockedQueryModule.useAppMutation;
const mockedUseQueryClient = useQueryClient as unknown as jest.Mock;
const mockedUseToast = useToast as unknown as jest.Mock;
const mockedResolveSuccessMessage =
  resolveSuccessMessage as unknown as jest.Mock;
const mockedDevicesApi = devicesApi as unknown as {
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  testConnection: jest.Mock;
};

describe('useDeviceMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedResolveSuccessMessage.mockImplementation(
      (message: string, action: string) => `${action}:${message}`,
    );
  });

  it('creates device, invalidates list query, and shows toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedDevicesApi.create.mockResolvedValue({ success: true });

    useDeviceCreate();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const payload = new FormData();

    await options.mutationFn(payload);
    expect(mockedDevicesApi.create).toHaveBeenCalledWith(payload);

    options.onSuccess({ message: 'Created' });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.device.lists(),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Created',
      'create',
    );
    expect(success).toHaveBeenCalledWith('create:Created');
  });

  it('updates device, invalidates list/detail queries, and shows toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedDevicesApi.update.mockResolvedValue({ success: true });

    useDeviceUpdate();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const payload = new FormData();
    const variables = { id: 17, payload };

    await options.mutationFn(variables);
    expect(mockedDevicesApi.update).toHaveBeenCalledWith(17, payload);

    options.onSuccess({ message: 'Updated' }, variables);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.device.lists(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.device.detail(variables.id),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Updated',
      'update',
    );
    expect(success).toHaveBeenCalledWith('update:Updated');
  });

  it('deletes device, invalidates list query, and shows toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedDevicesApi.delete.mockResolvedValue({ success: true });

    useDeviceDelete();

    const options = mockedUseAppMutation.mock.calls[0][0];

    await options.mutationFn(21);
    expect(mockedDevicesApi.delete).toHaveBeenCalledWith(21);

    options.onSuccess({ message: 'Deleted' }, 21);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.device.lists(),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Deleted',
      'delete',
    );
    expect(success).toHaveBeenCalledWith('delete:Deleted');
  });

  it('builds test-connection mutation and calls API', async () => {
    mockedDevicesApi.testConnection.mockResolvedValue({ success: true });

    useDeviceTestConnection();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const payload = new FormData();

    await options.mutationFn(payload);
    expect(mockedDevicesApi.testConnection).toHaveBeenCalledWith(payload);
    expect(options.onSuccess).toBeUndefined();
  });
});
