import type { ReactNode } from 'react';

export type UiBadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';
export type UiBadgeSize = 'sm' | 'md' | 'lg';
export type UiBadgeAppearance = 'default' | 'status';

export interface UiBadgeProps {
  children: ReactNode;
  variant?: UiBadgeVariant;
  size?: UiBadgeSize;
  appearance?: UiBadgeAppearance;
  className?: string;
}
