import { useCallback, useState } from 'react';

export interface PaginationState {
  page: number;
  rowsPerPage: number;
}

export interface UseAppPaginationOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
  /**
   * Optional callback to sync state when server returns a different page (e.g. clamp)
   */
  serverPage?: number;
}

/**
 * A generic hook to manage server-side pagination state.
 * Syncs with MUI TablePagination (0-based page).
 */
export function useAppPagination(options: UseAppPaginationOptions = {}) {
  const [page, setPage] = useState(options.initialPage ?? 0);
  const [rowsPerPage, setRowsPerPage] = useState(
    options.initialRowsPerPage ?? 10,
  );

  // Track previous serverPage in state to detect changes (React getDerivedStateFromProps pattern)
  const [prevServerPage, setPrevServerPage] = useState(options.serverPage);
  if (
    prevServerPage !== options.serverPage &&
    options.serverPage !== undefined
  ) {
    setPrevServerPage(options.serverPage);
    setPage(options.serverPage);
  }

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when size changes
  }, []);

  return {
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    // Helper to get params for API (already 0-based)
    apiParams: {
      page,
      size: rowsPerPage,
    },
  };
}
