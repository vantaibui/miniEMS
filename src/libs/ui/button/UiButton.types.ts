import type { MouseEventHandler, ReactNode } from 'react';

export type UiButtonSize = 'sm' | 'md' | 'lg';
export type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface UiButtonProps {
  children: ReactNode;
  size?: UiButtonSize;
  variant?: UiButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;
}
