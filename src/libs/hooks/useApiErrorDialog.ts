import { useDialogConfirm } from '@libs/ui';

import type { AppError } from '@services/http';

export type RetryOptions = {
  onRetry?: () => void | Promise<void>;
};

function isServerOrNetworkError(error: AppError): boolean {
  const {status} = error;
  return status === undefined || status >= 500;
}

export type ShowApiErrorDialogFn = (
  error: AppError,
  retry?: RetryOptions,
) => Promise<void>;

export function useApiErrorDialog(): ShowApiErrorDialogFn {
  const confirm = useDialogConfirm();

  return async (error: AppError, retry: RetryOptions = {}) => {
    const message = error.message || 'An unexpected error occurred';

    if (isServerOrNetworkError(error) && retry.onRetry) {
      const ok = await confirm({
        type: 'warning',
        title: 'Something went wrong?',
        description: message,
        confirmText: 'Retry',
        cancelText: 'Cancel',
      });

      if (ok) {
        await retry.onRetry();
      }
      return;
    }

    await confirm({
      type: 'warning',
      title: 'Request failed',
      description: message,
      confirmOnly: true,
      confirmText: 'OK',
    });
  };
}
