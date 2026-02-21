import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

export interface UiToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function UiToolbar({ left, right, children, className }: UiToolbarProps) {
  return (
    <div className={cn('flex min-w-0 items-center justify-between gap-3', className)}>
      {children ? (
        children
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-3">{left}</div>
          <div className="flex min-w-0 items-center gap-3">{right}</div>
        </>
      )}
    </div>
  );
}
