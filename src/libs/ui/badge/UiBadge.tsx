import Chip from '@mui/material/Chip';

import { cn } from '@libs/utils';

import type {
  UiBadgeAppearance,
  UiBadgeProps,
  UiBadgeSize,
  UiBadgeVariant,
} from './UiBadge.types';

function mapVariant(
  variant: UiBadgeVariant,
): 'default' | 'error' | 'info' | 'success' | 'warning' {
  switch (variant) {
    case 'default':
    case 'neutral':
      return 'default';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'danger':
      return 'error';
    case 'info':
      return 'info';
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function mapSize(size: UiBadgeSize): 'small' | 'medium' {
  switch (size) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
      return 'medium';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

function mapAppearanceClassName(appearance: UiBadgeAppearance): string {
  switch (appearance) {
    case 'default':
      return '';
    case 'status':
      return 'h-7 min-w-[104px] justify-center rounded-md [&_.MuiChip-label]:px-2 [&_.MuiChip-label]:font-semibold';
    default: {
      const _exhaustive: never = appearance;
      return _exhaustive;
    }
  }
}

export function UiBadge({
  children,
  variant = 'neutral',
  size = 'md',
  appearance = 'default',
  className,
}: UiBadgeProps) {
  const muiColor = mapVariant(variant);

  return (
    <Chip
      size={mapSize(size)}
      label={children}
      variant={variant === 'neutral' ? 'outlined' : 'filled'}
      color={muiColor}
      className={cn('min-w-0', mapAppearanceClassName(appearance), className)}
    />
  );
}
