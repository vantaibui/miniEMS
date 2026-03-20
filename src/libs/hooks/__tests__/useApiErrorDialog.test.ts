import { renderHook } from '@testing-library/react';

import { useApiErrorDialog } from '../useApiErrorDialog';

jest.mock('@libs/ui', () => ({
  useDialogConfirm: jest.fn(),
}));

const mockedUseDialogConfirm = (
  jest.requireMock('@libs/ui') as { useDialogConfirm: jest.Mock }
).useDialogConfirm;

const buildError = (status?: number, message = 'Request failed') => ({
  code: status ? `HTTP_${status}` : 'NETWORK_ERROR',
  message,
  fieldErrors: {},
  status,
});

describe('useApiErrorDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows retry dialog for server errors and executes retry on confirm', async () => {
    const confirm = jest.fn().mockResolvedValue(true);
    const onRetry = jest.fn().mockResolvedValue(undefined);
    mockedUseDialogConfirm.mockReturnValue(confirm);

    const { result } = renderHook(() => useApiErrorDialog());
    await result.current(buildError(500, 'Server down'), { onRetry });

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        title: 'Something went wrong?',
        description: 'Server down',
        confirmText: 'Retry',
        cancelText: 'Cancel',
      }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not execute retry when user cancels retry dialog', async () => {
    const confirm = jest.fn().mockResolvedValue(false);
    const onRetry = jest.fn().mockResolvedValue(undefined);
    mockedUseDialogConfirm.mockReturnValue(confirm);

    const { result } = renderHook(() => useApiErrorDialog());
    await result.current(buildError(503), { onRetry });

    expect(confirm).toHaveBeenCalledTimes(1);
    expect(onRetry).not.toHaveBeenCalled();
  });

  it('shows confirm-only dialog for client errors', async () => {
    const confirm = jest.fn().mockResolvedValue(true);
    const onRetry = jest.fn().mockResolvedValue(undefined);
    mockedUseDialogConfirm.mockReturnValue(confirm);

    const { result } = renderHook(() => useApiErrorDialog());
    await result.current(buildError(400, 'Bad request'), { onRetry });

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        title: 'Request failed',
        description: 'Bad request',
        confirmOnly: true,
        confirmText: 'OK',
      }),
    );
    expect(onRetry).not.toHaveBeenCalled();
  });

  it('shows confirm-only dialog when retry callback is not provided', async () => {
    const confirm = jest.fn().mockResolvedValue(true);
    mockedUseDialogConfirm.mockReturnValue(confirm);

    const { result } = renderHook(() => useApiErrorDialog());
    await result.current(buildError(undefined, 'Network error'));

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Request failed',
        confirmOnly: true,
        confirmText: 'OK',
      }),
    );
  });
});
