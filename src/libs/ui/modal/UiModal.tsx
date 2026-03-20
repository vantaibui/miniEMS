import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { cn } from '@libs/utils';

import type { UiModalSize, UiModalProps } from './UiModal.types';

function mapSize(size: UiModalSize): DialogProps['maxWidth'] {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'md':
      return 'md';
    case 'lg':
      return 'lg';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export function UiModal({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  loading,
  disableBackdropClose,
  className,
  'aria-label': ariaLabel,
}: UiModalProps) {
  const maxWidth = mapSize(size);
  const titleId = title ? 'ui-modal-title' : undefined;
  const contentId = 'ui-modal-content';

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (loading) return;
        if (
          disableBackdropClose &&
          (reason === 'backdropClick' || reason === 'escapeKeyDown')
        ) {
          return;
        }
        onClose();
      }}
      fullWidth
      maxWidth={maxWidth}
      aria-label={title ? undefined : ariaLabel}
      aria-labelledby={titleId}
      aria-describedby={contentId}
      className={cn(className)}
    >
      {title ? <DialogTitle id={titleId}>{title}</DialogTitle> : null}
      <DialogContent id={contentId} dividers>
        {children}
      </DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}
