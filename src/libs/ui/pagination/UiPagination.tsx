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

export function UiPagination({
  page,
  count,
  onChange,
  disabled,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: UiPaginationProps) {
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
