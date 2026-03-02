import { useCallback, useState, type ReactNode } from 'react';
import { ConfirmDialogContext } from './ConfirmDialogContext';
import { UiConfirmDialog } from './UiConfirmDialog';
import type { UiConfirmDialogProps } from './UiConfirmDialog.types';

type ConfirmOptions = Omit<UiConfirmDialogProps, 'isOpen' | 'onClose'>;

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (state) {
      state.resolve(false);
      setState(null);
    }
  }, [state]);

  const handleConfirm = useCallback(() => {
    if (state) {
      state.options.onConfirm?.();
      state.resolve(true);
      setState(null);
    }
  }, [state]);

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <UiConfirmDialog
          {...state.options}
          isOpen={state.isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
}
