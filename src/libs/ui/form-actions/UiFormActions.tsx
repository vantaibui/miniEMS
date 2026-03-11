import { Box } from '@mui/material';
import type { ReactNode } from 'react';

import { UiButton } from '../button';

type UiFormActionsProps = {
  onCancel: () => void;
  cancelDisabled?: boolean;
  submitDisabled?: boolean;
  loading?: boolean;
  submitLabel?: string;
  leadingActions?: ReactNode;
};

export function UiFormActions({
  onCancel,
  cancelDisabled,
  submitDisabled,
  loading,
  submitLabel = 'Save',
  leadingActions,
}: UiFormActionsProps) {
  return (
    <Box className="mt-4 flex items-center justify-between border-t border-divider pt-3">
      <Box>{leadingActions}</Box>

      <Box className="flex items-center gap-2">
        <UiButton
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={cancelDisabled}
        >
          Cancel
        </UiButton>

        <UiButton
          type="submit"
          variant="contained"
          disabled={submitDisabled}
          loading={loading}
        >
          {submitLabel}
        </UiButton>
      </Box>
    </Box>
  );
}
