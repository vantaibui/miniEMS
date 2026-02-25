import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { DialogProps } from '@mui/material/Dialog';

import { tokens } from '../theme/tokens';
import { UiButton } from '../button';
import type { UiConfirmDialogProps, UiConfirmDialogType } from './UiConfirmDialog.types';

type VariantConfig = {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  confirmButtonSx: NonNullable<React.ComponentProps<typeof UiButton>['sx']>;
};

function getVariantConfig(type: UiConfirmDialogType): VariantConfig {
  switch (type) {
    case 'delete':
      return {
        icon: <DeleteOutlineIcon sx={{ color: tokens.colors.error.main }} />,
        iconColor: tokens.colors.error.main,
        iconBg: 'rgba(211, 47, 47, 0.08)',
        confirmButtonSx: {
          backgroundColor: tokens.colors.error.main,
          '&:hover': { backgroundColor: tokens.colors.error.dark },
        },
      };
    case 'warning':
      return {
        icon: <ErrorOutlineIcon sx={{ color: tokens.colors.warning.main }} />,
        iconColor: tokens.colors.warning.main,
        iconBg: 'rgba(237, 108, 2, 0.10)',
        confirmButtonSx: {
          backgroundColor: tokens.colors.warning.main,
          '&:hover': { backgroundColor: tokens.colors.warning.dark },
        },
      };
    case 'success':
      return {
        icon: <CheckCircleOutlineIcon sx={{ color: tokens.colors.success.main }} />,
        iconColor: tokens.colors.success.main,
        iconBg: 'rgba(46, 125, 50, 0.10)',
        confirmButtonSx: {
          backgroundColor: tokens.colors.success.light,
          '&:hover': { backgroundColor: tokens.colors.success.main },
        },
      };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

const PAPER_SX: DialogProps['PaperProps'] = {
  sx: {
    borderRadius: '24px',
    p: 0,
    boxShadow: tokens.shadows.sm,
    border: `1px solid ${tokens.colors.neutral[200]}`,
    backgroundColor: tokens.colors.neutral[50],
  },
};

export function UiConfirmDialog({
  isOpen,
  onClose,
  type,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmOnly,
  showCloseIcon = true,
}: UiConfirmDialogProps) {
  const variant = getVariantConfig(type);

  const isSingleButton = confirmOnly ?? type === 'success';

  return (
    <Dialog
      open={isOpen}
      onClose={(_e, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          onClose();
          return;
        }
        onClose();
      }}
      PaperProps={PAPER_SX}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent
        sx={{
          p: 4,
          pt: 3,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {showCloseIcon ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: tokens.colors.neutral[600],
              backgroundColor: tokens.colors.neutral[100],
              '&:hover': { backgroundColor: tokens.colors.neutral[200] },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null}

        <Box
          sx={{
            mx: 'auto',
            mb: 2,
            width: 56,
            height: 56,
            borderRadius: '9999px',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: variant.iconBg,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'grid',
              placeItems: 'center',
              '& svg': { fontSize: 24, color: variant.iconColor },
            }}
          >
            {variant.icon}
          </Box>
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: tokens.typography.sizes.xl }}>
          {title}
        </Typography>

        {description ? (
          <Typography
            sx={{
              mt: 0.75,
              color: tokens.colors.neutral[600],
              fontSize: tokens.typography.sizes.sm,
            }}
          >
            {description}
          </Typography>
        ) : null}

        <Stack
          direction={isSingleButton ? 'column' : 'row'}
          spacing={1.5}
          sx={{
            mt: 3,
            ...(isSingleButton
              ? { alignItems: 'center' }
              : { alignItems: 'stretch' }),
          }}
        >
          {!isSingleButton ? (
            <UiButton
              variant="outlined"
              color="inherit"
              onClick={onClose}
              fullWidth
              sx={{
                flex: 1,
                borderRadius: '9999px',
                borderColor: tokens.colors.neutral[200],
                color: tokens.colors.neutral[900],
                backgroundColor: tokens.colors.neutral[50],
                '&:hover': {
                  backgroundColor: tokens.colors.neutral[100],
                  borderColor: tokens.colors.neutral[200],
                },
              }}
            >
              {cancelText}
            </UiButton>
          ) : null}

          <UiButton
            variant="contained"
            onClick={() => {
              onConfirm?.();
            }}
            fullWidth={isSingleButton}
            sx={{
              flex: 1,
              borderRadius: '9999px',
              color: tokens.colors.neutral[50],
              ...(isSingleButton
                ? { minWidth: 220 }
                : null),
              ...variant.confirmButtonSx,
            }}
          >
            {confirmText}
          </UiButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
