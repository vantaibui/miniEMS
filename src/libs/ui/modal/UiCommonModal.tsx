import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';

import { tokens } from '../theme/tokens';

import type {
  UiCommonModalProps,
  UiCommonModalSize,
} from './UiCommonModal.types';
import type { DialogProps } from '@mui/material/Dialog';

function mapSize(size: UiCommonModalSize): DialogProps['maxWidth'] {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'md':
      return 'md';
    case 'lg':
      return 'lg';
    case 'xl':
      return 'xl';
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const UiCommonModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  size = 'lg',
  disableBackdropClose,
  loading,
  contentSx,
  actionsSx,
  fullScreen,
}: UiCommonModalProps) => {
  const maxWidth = mapSize(size);

  const handleRequestClose = () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    onClose();
  };

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
        handleRequestClose();
      }}
      fullWidth
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: tokens.shadows.modal,
          },
        },
      }}
    >
      <Box
        className="flex items-start justify-between gap-2 px-3 py-2"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: tokens.colors.surface.modalHeader,
        }}
      >
        <Box>
          {title ? title : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" className="mt-1">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <IconButton
          onClick={handleRequestClose}
          size="small"
          aria-label="Close dialog"
          className="mt-1"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        className="p-3"
        sx={{
          bgcolor: 'background.paper',
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>
      {actions ? (
        <DialogActions
          className="px-3 py-2"
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: tokens.colors.surface.modalHeader,
            ...actionsSx,
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
};
