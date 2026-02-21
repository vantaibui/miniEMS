import type { ReactNode } from 'react';

export type UiAlertVariant = 'filled' | 'outlined' | 'standard';
export type UiAlertSeverity = 'success' | 'info' | 'warning' | 'error';

export interface UiAlertProps {
  children: ReactNode;
  severity?: UiAlertSeverity;
  variant?: UiAlertVariant;
  title?: ReactNode;
  onClose?: () => void;
  className?: string;
  icon?: ReactNode;
  /**
   * Optional close icon (pass from app layer for Micro-FE portability)
   */
  closeIcon?: ReactNode;
}
