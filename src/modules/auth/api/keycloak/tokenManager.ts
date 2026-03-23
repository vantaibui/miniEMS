import { keycloak } from './client';

export const isAuthenticated = () => !!keycloak.authenticated;

export const getToken = () => keycloak.token;

let isRefreshing = false;
let refreshPromise: Promise<string | undefined> | null = null;
let refreshQueue: Array<{
  resolve: (token?: string) => void;
  reject: (err: unknown) => void;
}> = [];

const enqueueRefreshWaiter = () =>
  new Promise<string | undefined>((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });

const flushRefreshQueue = (err: unknown, token?: string) => {
  refreshQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  refreshQueue = [];
};

/**
 * Refresh Token with Mutex/Queue
 * Prevents multiple concurrent refresh calls.
 */
export const refreshToken = async (
  minValiditySeconds = 60,
): Promise<string | undefined> => {
  if (!isAuthenticated()) return undefined;

  if (isRefreshing && refreshPromise) {
    return enqueueRefreshWaiter();
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      await keycloak.updateToken(minValiditySeconds);
      const {token} = keycloak;
      flushRefreshQueue(null, token);
      return token;
    } catch (err) {
      flushRefreshQueue(err);
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Background Session Watcher
 * Periodically ensures the token is fresh.
 */
export const startSessionWatcher = (options?: {
  intervalMs?: number;
  minValiditySeconds?: number;
  onRefreshError?: (err: unknown) => void;
}) => {
  const intervalMs = options?.intervalMs ?? 60_000;
  const minValiditySeconds = options?.minValiditySeconds ?? 60;

  const id = window.setInterval(() => {
    if (!keycloak.authenticated) return;

    refreshToken(minValiditySeconds).catch((err) => {
      options?.onRefreshError?.(err);
    });
  }, intervalMs);

  return () => window.clearInterval(id);
};
