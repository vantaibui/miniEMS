import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '@libs/hooks';

import { resolveSuccessMessage } from '@services/http';

import { rolesApi } from '../../api';
import {
  useRoleCreate,
  useRoleDelete,
  useRoleUpdate,
} from '../useRoleMutations';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@libs/query', () => ({
  queryKeys: {
    roles: {
      lists: () => ['roles', 'list'],
      details: () => ['roles', 'detail'],
      permissionsById: (id: number | string) => ['roles', 'permissions', id],
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
  rolesApi: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedQueryModule = jest.requireMock('@libs/query') as {
  queryKeys: {
    roles: {
      lists: () => Array<unknown>;
      details: () => Array<unknown>;
      permissionsById: (id: number | string) => Array<unknown>;
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
const mockedRolesApi = rolesApi as unknown as {
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('useRoleMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedResolveSuccessMessage.mockImplementation(
      (message: string, action: string) => `${action}:${message}`,
    );
  });

  it('creates role, invalidates role lists, and shows success toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedRolesApi.create.mockResolvedValue({ success: true });

    useRoleCreate();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const payload = { name: 'Operator' };

    await options.mutationFn(payload);
    expect(mockedRolesApi.create).toHaveBeenCalledWith(payload);

    options.onSuccess({ message: 'Created' });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.lists(),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Created',
      'create',
    );
    expect(success).toHaveBeenCalledWith('create:Created');
  });

  it('updates role, invalidates list/detail/permissions, and shows success toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedRolesApi.update.mockResolvedValue({ success: true });

    useRoleUpdate();

    const options = mockedUseAppMutation.mock.calls[0][0];
    const variables = {
      id: 33,
      payload: { name: 'Admin' },
    };

    await options.mutationFn(variables);
    expect(mockedRolesApi.update).toHaveBeenCalledWith(33, variables.payload);

    options.onSuccess({ message: 'Updated' }, variables);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.lists(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.details(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.permissionsById(variables.id),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Updated',
      'update',
    );
    expect(success).toHaveBeenCalledWith('update:Updated');
  });

  it('deletes role, invalidates list/detail/permissions, and shows success toast', async () => {
    const invalidateQueries = jest.fn();
    const success = jest.fn();
    mockedUseQueryClient.mockReturnValue({ invalidateQueries });
    mockedUseToast.mockReturnValue({ success });
    mockedRolesApi.delete.mockResolvedValue({ success: true });

    useRoleDelete();

    const options = mockedUseAppMutation.mock.calls[0][0];

    await options.mutationFn(44);
    expect(mockedRolesApi.delete).toHaveBeenCalledWith(44);

    options.onSuccess({ message: 'Deleted' }, 44);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.lists(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.details(),
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.roles.permissionsById(44),
    });
    expect(mockedResolveSuccessMessage).toHaveBeenCalledWith(
      'Deleted',
      'delete',
    );
    expect(success).toHaveBeenCalledWith('delete:Deleted');
  });
});
