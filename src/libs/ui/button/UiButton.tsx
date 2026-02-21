import { forwardRef } from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { cn } from '../utils/cn';
import type { UiButtonProps, UiButtonSize, UiButtonVariant } from './UiButton.types';

type MuiButtonVariant = 'contained' | 'outlined' | 'text';

type VariantMapping = {
  muiVariant: MuiButtonVariant;
  muiColor?: 'primary' | 'secondary' | 'error' | 'inherit';
};

function mapVariant(variant: UiButtonVariant): VariantMapping {
  switch (variant) {
    case 'primary':
      return { muiVariant: 'contained', muiColor: 'primary' };
    case 'secondary':
      return { muiVariant: 'outlined', muiColor: 'inherit' };
    case 'ghost':
      return { muiVariant: 'text', muiColor: 'inherit' };
    case 'danger':
      return { muiVariant: 'contained', muiColor: 'error' };
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function mapSize(size: UiButtonSize): 'small' | 'medium' | 'large' {
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

export const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      disabled,
      loading,
      fullWidth,
      startIcon,
      endIcon,
      type = 'button',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const mappedVariant = mapVariant(variant);
    const muiSize = mapSize(size);

    const isDisabled = Boolean(disabled || loading);

    return (
      <MuiButton
        ref={ref}
        type={type}
        variant={mappedVariant.muiVariant}
        color={mappedVariant.muiColor}
        size={muiSize}
        disabled={isDisabled}
        fullWidth={fullWidth}
        startIcon={loading ? undefined : startIcon}
        endIcon={loading ? undefined : endIcon}
        className={cn(
          'min-w-0',
          loading && 'pointer-events-none',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className={cn('inline-flex items-center gap-2', fullWidth && 'justify-center')}>
            <CircularProgress size={16} color="inherit" />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </MuiButton>
    );
  },
);

UiButton.displayName = 'UiButton';
