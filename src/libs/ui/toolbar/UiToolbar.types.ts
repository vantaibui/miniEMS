import type { ReactNode } from 'react';

export interface UiToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}
