import type { ReactNode } from 'react';

export type UiModalSize = 'sm' | 'md' | 'lg';

export interface UiModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  size?: UiModalSize;
  loading?: boolean;
  disableBackdropClose?: boolean;
  className?: string;
  'aria-label'?: string;
}
