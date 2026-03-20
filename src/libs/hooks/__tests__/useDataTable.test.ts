import { act, renderHook } from '@testing-library/react';

import { useDataTable } from '../useDataTable';

describe('useDataTable', () => {
  it('returns default table state', () => {
    const { result } = renderHook(() => useDataTable());

    expect(result.current.page).toBe(0);
    expect(result.current.size).toBe(10);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.sortBy).toBe('');
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.filterValue).toBe('all');
    expect(result.current.tabValue).toBe(0);
  });

  it('uses provided initial options', () => {
    const { result } = renderHook(() =>
      useDataTable({
        page: 1,
        size: 20,
        searchQuery: 'abc',
        sortBy: 'name',
        sortDirection: 'desc',
        filterValue: 'active',
        tabValue: 2,
      }),
    );

    expect(result.current.page).toBe(1);
    expect(result.current.size).toBe(20);
    expect(result.current.searchQuery).toBe('abc');
    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.filterValue).toBe('active');
    expect(result.current.tabValue).toBe(2);
  });

  it('updates state via setters', () => {
    const { result } = renderHook(() => useDataTable());

    act(() => {
      result.current.setPage(3);
      result.current.setSize(50);
      result.current.setSearchQuery('query');
      result.current.setSortBy('createdAt');
      result.current.setSortDirection('desc');
      result.current.setFilterValue('inactive');
      result.current.setTabValue(1);
    });

    expect(result.current.page).toBe(3);
    expect(result.current.size).toBe(50);
    expect(result.current.searchQuery).toBe('query');
    expect(result.current.sortBy).toBe('createdAt');
    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.filterValue).toBe('inactive');
    expect(result.current.tabValue).toBe(1);
  });
});
