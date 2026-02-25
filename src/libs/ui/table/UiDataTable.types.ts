import type { ReactNode } from 'react';

export type UiDataTableId = string | number;

export type UiDataTableAlign = 'left' | 'center' | 'right';

export interface UiDataTableColumn<TData> {
  key: string;
  header: ReactNode;
  width?: number | string;
  align?: UiDataTableAlign;
  render: (row: TData, index: number) => ReactNode;
}

export interface UiDataTablePagination {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export interface UiDataTableProps<TData> {
  rows: Array<TData>;
  columns: Array<UiDataTableColumn<TData>>;
  getRowId: (row: TData) => UiDataTableId;

  loading?: boolean;
  emptyState?: ReactNode;

  pagination?: UiDataTablePagination;

  className?: string;
  'aria-label'?: string;
}
