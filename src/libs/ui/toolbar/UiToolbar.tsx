import type { ReactNode } from 'react';

import { Box } from '@mui/material';

import { cn } from '../utils/cn';

export interface UiToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function UiToolbar({
  left,
  right,
  children,
  className,
}: UiToolbarProps) {
  return (
    <Box
      className={cn(
        'flex min-w-0 items-center justify-between gap-3',
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <Box className="flex min-w-0 items-center gap-3">{left}</Box>
          <Box className="flex min-w-0 items-center gap-3">{right}</Box>
        </>
      )}
    </Box>
  );
}
