import type { ReactNode } from 'react';

export type UiCardVariant = 'default' | 'outlined';
export type UiCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface UiCardProps {
  children: ReactNode;
  variant?: UiCardVariant;
  padding?: UiCardPadding;
  className?: string;
}
