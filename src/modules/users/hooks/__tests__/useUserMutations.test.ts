import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@libs/hooks';

import { usersApi } from '../../api';
import {
  useUserCreate,
  useUserDelete,
  useUserUpdate,
} from '../useUserMutations';

import { resolveSuccessMessage } from '@/services/http';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@/libs/query', () => ({
  queryKeys: {
    users: {
      lists: () => ['users', 'list'],
      detail: (id: number | string) => ['users', 'detail', id],
    },
  },
  useAppMutation: jest.fn(),
}));

jest.mock('@/services/http', () => ({
  resolveSuccessMessage: jest.fn(),
}));

jest.mock('@libs/hooks', () => ({
  useToast: jest.fn(),
}));

jest.mock('../../api', () => ({
  usersApi: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedQueryModule = jest.requireMock('@/libs/query') as {
  queryKeys: {
    users: {
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
const mockedUsersApi = usersApi as unknown as {
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('useUserMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedResolveSuccessMessage.mockImplementation(
      (message: string, action: string) => `${action}:${message}`,
    );
  });

  it('creates user, invalidates list query, and shows success toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedUsersApi.create.mockResolvedValue({ success: true });

    useUserCreate();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const payload = { name: 'Alice' };

    await options.mutationFn(payload);
    expect(mockedUsersApi.create).toHaveBeenCalledWith(payload);

    options.onSuccess({ message: 'Created' });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.users.lists(),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Created',
      'create',
    );
    expect(success).toHaveBeenCalledWith('create:Created');
  });

  it('updates user, invalidates list/detail queries, and shows success toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedUsersApi.update.mockResolvedValue({ success: true });

    useUserUpdate();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const variables = {
      id: 7,
      payload: { name: 'Bob' },
    };

    await options.mutationFn(variables);
    expect(mockedUsersApi.update).toHaveBeenCalledWith(7, variables.payload);

    options.onSuccess({ message: 'Updated' }, variables);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.users.lists(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.users.detail(variables.id),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Updated',
      'update',
    );
    expect(success).toHaveBeenCalledWith('update:Updated');
  });

  it('deletes user, invalidates list/detail queries, and shows success toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedUsersApi.delete.mockResolvedValue({ success: true });

    useUserDelete();

    const options = mockedUseAppMutation.mock.calls[0][0];

    await options.mutationFn(11);
    expect(mockedUsersApi.delete).toHaveBeenCalledWith(11);

    options.onSuccess({ message: 'Deleted' }, 11);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.users.lists(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.users.detail(11),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Deleted',
      'delete',
    );
    expect(success).toHaveBeenCalledWith('delete:Deleted');
  });
});
