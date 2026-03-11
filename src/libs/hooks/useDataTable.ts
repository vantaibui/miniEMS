import { useState } from 'react';

export type DataTableSortDirection = 'asc' | 'desc';

interface UseDataTableOptions {
  page?: number;
  size?: number;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: DataTableSortDirection;
  filterValue?: string;
  tabValue?: number;
}

export function useDataTable(options?: UseDataTableOptions) {
  const [page, setPage] = useState(options?.page ?? 0);
  const [size, setSize] = useState(options?.size ?? 10);
  const [searchQuery, setSearchQuery] = useState(options?.searchQuery ?? '');
  const [sortBy, setSortBy] = useState(options?.sortBy ?? '');
  const [sortDirection, setSortDirection] = useState<DataTableSortDirection>(
    options?.sortDirection ?? 'asc',
  );
  const [filterValue, setFilterValue] = useState(options?.filterValue ?? 'all');
  const [tabValue, setTabValue] = useState(options?.tabValue ?? 0);

  return {
    page,
    size,
    searchQuery,
    sortBy,
    sortDirection,
    filterValue,
    tabValue,
    setPage,
    setSize,
    setSearchQuery,
    setSortBy,
    setSortDirection,
    setFilterValue,
    setTabValue,
  };
}
