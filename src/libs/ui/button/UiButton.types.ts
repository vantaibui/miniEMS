import type { ReactNode } from 'react';

import type { ButtonProps } from '@mui/material/Button';

export type UiButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
export type UiButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'warning'
  | 'success'
  | 'contained'
  | 'outlined'
  | 'text';

export interface UiButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  children?: ReactNode;
  size?: UiButtonSize;
  variant?: UiButtonVariant;
  loading?: boolean;
}
