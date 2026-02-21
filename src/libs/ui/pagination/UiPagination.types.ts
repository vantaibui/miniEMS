export type UiPaginationSize = 'sm' | 'md' | 'lg';

export interface UiPaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  size?: UiPaginationSize;
  className?: string;
  'aria-label'?: string;
}
