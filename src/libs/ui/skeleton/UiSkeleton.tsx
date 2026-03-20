import Skeleton from '@mui/material/Skeleton';

import { cn } from '../utils/cn';

import type { UiSkeletonProps } from './UiSkeleton.types';

export function UiSkeleton({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  className,
}: UiSkeletonProps) {
  return (
    <Skeleton
      variant={variant}
      animation={animation}
      width={width}
      height={height}
      className={cn(className)}
    />
  );
}
