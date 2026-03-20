import Pagination from '@mui/material/Pagination';

import { cn } from '../utils/cn';

import type { UiPaginationProps, UiPaginationSize } from './UiPagination.types';

function mapSize(size: UiPaginationSize): 'small' | 'medium' | 'large' {
  switch (size) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
      return 'large';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export function UiPagination(props: UiPaginationProps) {
  const { disabled, size = 'md', className, 'aria-label': ariaLabel } = props;

  if ('pagination' in props) {
    const { pagination, onChange } = props;
    return (
      <Pagination
        page={pagination.page + 1} // MUI is 1-based, BE is 0-based
        count={pagination.totalPages}
        onChange={(_e, nextPage) =>
          onChange({ page: nextPage - 1, size: pagination.size })
        }
        disabled={disabled}
        size={mapSize(size)}
        className={cn(className)}
        aria-label={ariaLabel}
      />
    );
  }

  const { page, count, onChange } = props;
  return (
    <Pagination
      page={page}
      count={count}
      onChange={(_e, next) => onChange(next)}
      disabled={disabled}
      size={mapSize(size)}
      className={cn(className)}
      aria-label={ariaLabel}
    />
  );
}
