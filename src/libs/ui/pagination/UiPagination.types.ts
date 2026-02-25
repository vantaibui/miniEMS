import type { PaginationResult } from '@services/http';

export type UiPaginationSize = 'sm' | 'md' | 'lg';

export type UiPaginationOnChangePayload = {
  page: number;
  size: number;
};

export type UiPaginationBaseProps = {
  disabled?: boolean;
  size?: UiPaginationSize;
  className?: string;
  'aria-label'?: string;
};

export type UiPaginationProps =
  | (UiPaginationBaseProps & {
      /**
       * 1-based page index (MUI Pagination)
       */
      page: number;
      count: number;
      onChange: (page: number) => void;
    })
  | (UiPaginationBaseProps & {
      /**
       * Backend pagination contract (0-based page)
       */
      pagination: PaginationResult;
      onChange: (payload: UiPaginationOnChangePayload) => void;
    });
