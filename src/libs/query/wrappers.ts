import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import type { ApiSuccessResponse, AppError } from '@services/http';
import { useApiErrorDialog } from '@libs/hooks';

type AppQueryOptions<
  TQueryFnData,
  TData,
  TKey extends ReadonlyArray<unknown>,
> = UseQueryOptions<TQueryFnData, AppError, TData, TKey> & {
  /**
   * Whether to show error dialog automatically.
   * Default: true
   */
  errorDialog?: boolean;

  /**
   * Whether to show Retry dialog (for network/5xx) and refetch on confirm.
   * Default: true
   */
  retryDialog?: boolean;

  /**
   * Custom error handler
   */
  onError?: (err: AppError) => void | Promise<void>;
};

export function useAppQuery<
  TQueryFnData extends ApiSuccessResponse<unknown>,
  TData = TQueryFnData,
  TKey extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
>(
  options: AppQueryOptions<TQueryFnData, TData, TKey>,
): UseQueryResult<TData, AppError> {
  const showErrorDialog = useApiErrorDialog();
  const queryClient = useQueryClient();
  const lastErrorRef = useRef<AppError | null>(null);

  const {
    errorDialog = true,
    retryDialog = true,
    onError,
    queryKey,
    ...rest
  } = options;

  const query = useQuery<TQueryFnData, AppError, TData, TKey>({
    ...rest,
    queryKey,
  });

  useEffect(() => {
    if (query.error && query.error !== lastErrorRef.current) {
      lastErrorRef.current = query.error;
      const appError = query.error;

      const handleEffect = async () => {
        if (onError) {
          await onError(appError);
        }

        if (errorDialog) {
          if (retryDialog) {
            await showErrorDialog(appError, {
              onRetry: async () => {
                lastErrorRef.current = null;
                await queryClient.refetchQueries({ queryKey: queryKey });
              },
            });
          } else {
            await showErrorDialog(appError, {});
          }
        }
      };

      handleEffect();
    } else if (!query.error) {
      lastErrorRef.current = null;
    }
  }, [
    query.error,
    queryKey,
    errorDialog,
    retryDialog,
    onError,
    queryClient,
    showErrorDialog,
  ]);

  return query;
}

type AppMutationOptions<TData, TVariables, TContext> = UseMutationOptions<
  TData,
  AppError,
  TVariables,
  TContext
> & {
  /**
   * Whether to show error dialog automatically.
   * Default: true
   */
  errorDialog?: boolean;

  /**
   * Whether to show Retry dialog (for network/5xx).
   * Default: true
   */
  retryDialog?: boolean;

  /**
   * Custom error handler matching UseMutationOptions signature or simplified
   */
  onAppError?: (
    err: AppError,
    variables: TVariables,
    context: TContext | undefined,
  ) => void | Promise<void>;
};

export function useAppMutation<TData, TVariables = void, TContext = unknown>(
  options: AppMutationOptions<TData, TVariables, TContext>,
): UseMutationResult<TData, AppError, TVariables, TContext> {
  const showErrorDialog = useApiErrorDialog();
  const {
    errorDialog = true,
    retryDialog = true,
    onAppError,
    mutationFn,
    ...rest
  } = options;

  return useMutation<TData, AppError, TVariables, TContext>({
    ...rest,
    mutationFn,
    onError: async (err, variables, context) => {
      if (onAppError) {
        await onAppError(err, variables, context);
      }

      if (!errorDialog) return;

      if (retryDialog && mutationFn) {
        await showErrorDialog(err, {
          onRetry: async () => {
            await mutationFn(variables);
          },
        });
      } else {
        await showErrorDialog(err, {});
      }
    },
  });
}
