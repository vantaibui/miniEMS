import type { ReactNode } from 'react';

import type { SxProps, Theme } from '@mui/material/styles';

export type UiCommonModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface UiCommonModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  size?: UiCommonModalSize;
  disableBackdropClose?: boolean;
  loading?: boolean;
  contentSx?: SxProps<Theme>;
  actionsSx?: SxProps<Theme>;
  fullScreen?: boolean;
}
