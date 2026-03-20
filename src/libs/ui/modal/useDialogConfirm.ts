import { useContext } from 'react';

import { ConfirmDialogContext } from './ConfirmDialogContext';

export function useDialogConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      'useDialogConfirm must be used within a ConfirmDialogProvider',
    );
  }
  return context.confirm;
}
