export type UiSkeletonVariant = 'text' | 'rectangular' | 'rounded' | 'circular';
export type UiSkeletonAnimation = 'pulse' | 'wave' | false;

export interface UiSkeletonProps {
  variant?: UiSkeletonVariant;
  animation?: UiSkeletonAnimation;
  width?: number | string;
  height?: number | string;
  className?: string;
}
