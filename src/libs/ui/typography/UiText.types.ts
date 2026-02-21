import type { ElementType, ReactNode } from 'react';

export type UiTextVariant = 'heading' | 'subheading' | 'body' | 'caption';
export type UiTextTone = 'default' | 'secondary' | 'muted' | 'danger' | 'success' | 'warning' | 'info';

export interface UiTextProps {
  children: ReactNode;
  variant?: UiTextVariant;
  tone?: UiTextTone;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  noWrap?: boolean;
  gutterBottom?: boolean;
  className?: string;
  component?: ElementType;
}
