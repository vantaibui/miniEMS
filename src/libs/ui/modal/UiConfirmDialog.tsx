import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';

import { UiButton } from '../button';
import { tokens } from '../theme/tokens';

import type {
  UiConfirmDialogProps,
  UiConfirmDialogType,
} from './UiConfirmDialog.types';
import type { DialogProps } from '@mui/material/Dialog';

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
        iconBg: tokens.colors.dialog.iconErrorBg,
        confirmButtonSx: {
          backgroundColor: tokens.colors.error.main,
          '&:hover': { backgroundColor: tokens.colors.error.dark },
        },
      };
    case 'warning':
      return {
        icon: <ErrorOutlineIcon sx={{ color: tokens.colors.warning.main }} />,
        iconColor: tokens.colors.warning.main,
        iconBg: tokens.colors.dialog.iconWarningBg,
        confirmButtonSx: {
          backgroundColor: tokens.colors.warning.main,
          '&:hover': { backgroundColor: tokens.colors.warning.dark },
        },
      };
    case 'success':
      return {
        icon: (
          <CheckCircleOutlineIcon sx={{ color: tokens.colors.success.main }} />
        ),
        iconColor: tokens.colors.success.main,
        iconBg: tokens.colors.dialog.iconSuccessBg,
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
    borderRadius: tokens.shape.borderRadius.lg,
    p: 0,
    boxShadow: tokens.shadows.sm,
    border: `1px solid ${tokens.colors.neutral[200]}`,
    backgroundColor: tokens.colors.surface.pageBg,
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
        className="relative p-4 pt-3 text-center"
      >
        {showCloseIcon ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            className="absolute right-2.5 top-2.5"
            sx={{
              color: tokens.colors.neutral[600],
              backgroundColor: tokens.colors.neutral[100],
              '&:hover': { backgroundColor: tokens.colors.neutral[200] },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null}

        <Box
          className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full"
          sx={{
            backgroundColor: variant.iconBg,
          }}
        >
          <Box
            className="grid h-8 w-8 place-items-center"
            sx={{
              '& svg': { fontSize: 24, color: variant.iconColor },
            }}
          >
            {variant.icon}
          </Box>
        </Box>

        <Typography
          sx={{ fontWeight: tokens.typography.fontWeight.bold, fontSize: tokens.typography.sizes.xl }}
        >
          {title}
        </Typography>

        {description ? (
          <Typography
            className="mt-1.5 text-neutral-600"
            sx={{ fontSize: tokens.typography.sizes.sm }}
          >
            {description}
          </Typography>
        ) : null}

        <Box
          className={isSingleButton ? 'mt-6 flex flex-col items-center gap-3' : 'mt-6 flex flex-row items-stretch gap-3'}
        >
          {!isSingleButton ? (
            <UiButton
              variant="outlined"
              color="inherit"
              onClick={onClose}
              fullWidth
              sx={{
                flex: 1,
                borderRadius: tokens.shape.borderRadius.full,
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
              borderRadius: tokens.shape.borderRadius.full,
              color: tokens.colors.neutral[50],
              ...(isSingleButton ? { minWidth: 220 } : null),
              ...variant.confirmButtonSx,
            }}
          >
            {confirmText}
          </UiButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
