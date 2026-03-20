export type UiConfirmDialogType = 'delete' | 'warning' | 'success';

export type UiConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;

  type: UiConfirmDialogType;
  title: string;
  description?: string;

  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;

  /**
   * When true, dialog will render only 1 action button (Confirm).
   * Useful for cases like "Retry" / "OK".
   *
   * Default behavior:
   * - success: true
   * - delete/warning: false
   */
  confirmOnly?: boolean;

  showCloseIcon?: boolean;
};
