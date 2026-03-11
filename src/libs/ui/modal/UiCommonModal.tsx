import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import type { DialogProps } from '@mui/material/Dialog';

import type { UiCommonModalProps, UiCommonModalSize } from './UiCommonModal.types';

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
            bgcolor: '#FFFFFF',
            boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.2)',
          },
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: '#E2E8F0',
          bgcolor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <Box>
          {title ? title : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <IconButton
          onClick={handleRequestClose}
          size="small"
          aria-label="Close dialog"
          sx={{ mt: 0.25 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 3,
          bgcolor: '#FFFFFF',
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>
      {actions ? (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: '#E2E8F0',
            bgcolor: '#F8FAFC',
            ...actionsSx,
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
};
