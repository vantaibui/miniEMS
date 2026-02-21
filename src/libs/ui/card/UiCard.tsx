import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { cn } from '../utils/cn';
import type { UiCardPadding, UiCardProps } from './UiCard.types';

function paddingClass(padding: UiCardPadding) {
  switch (padding) {
    case 'none':
      return 'p-0';
    case 'sm':
      return 'p-3';
    case 'md':
      return 'p-4';
    case 'lg':
      return 'p-6';
    default: {
      const _exhaustive: never = padding;
      return _exhaustive;
    }
  }
}

export function UiCard({
  children,
  variant = 'outlined',
  padding = 'md',
  className,
}: UiCardProps) {
  return (
    <Card
      variant={variant === 'outlined' ? 'outlined' : undefined}
      className={cn('min-w-0', className)}
    >
      <CardContent className={cn('min-w-0', paddingClass(padding))}>
        {children}
      </CardContent>
    </Card>
  );
}
