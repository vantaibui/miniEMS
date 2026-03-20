import { act, renderHook } from '@testing-library/react';

import { useAppPagination } from '../useAppPagination';

describe('useAppPagination', () => {
  it('returns default pagination state', () => {
    const { result } = renderHook(() => useAppPagination());

    expect(result.current.page).toBe(0);
    expect(result.current.rowsPerPage).toBe(10);
    expect(result.current.apiParams).toEqual({ page: 0, size: 10 });
  });

  it('uses provided initial page and rows per page', () => {
    const { result } = renderHook(() =>
      useAppPagination({ initialPage: 2, initialRowsPerPage: 25 }),
    );

    expect(result.current.page).toBe(2);
    expect(result.current.rowsPerPage).toBe(25);
    expect(result.current.apiParams).toEqual({ page: 2, size: 25 });
  });

  it('updates page through onPageChange', () => {
    const { result } = renderHook(() => useAppPagination());

    act(() => {
      result.current.onPageChange(4);
    });

    expect(result.current.page).toBe(4);
    expect(result.current.apiParams.page).toBe(4);
  });

  it('updates rows per page and resets page through onRowsPerPageChange', () => {
    const { result } = renderHook(() =>
      useAppPagination({ initialPage: 3, initialRowsPerPage: 10 }),
    );

    act(() => {
      result.current.onRowsPerPageChange(50);
    });

    expect(result.current.rowsPerPage).toBe(50);
    expect(result.current.page).toBe(0);
    expect(result.current.apiParams).toEqual({ page: 0, size: 50 });
  });

  it('syncs local page with serverPage changes', () => {
    const { result, rerender } = renderHook(
      ({ serverPage }: { serverPage: number | undefined }) =>
        useAppPagination({ serverPage }),
      { initialProps: { serverPage: undefined as number | undefined } },
    );

    expect(result.current.page).toBe(0);

    rerender({ serverPage: 5 });
    rerender({ serverPage: 5 });

    expect(result.current.page).toBe(5);
  });
});
