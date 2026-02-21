import type { ReactNode } from 'react';

export interface UiSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onClear?: () => void;

  /**
   * Optional icons (pass from app layer for Micro-FE portability)
   */
  startIcon?: ReactNode;
  clearIcon?: ReactNode;

  className?: string;
  'aria-label'?: string;
}
