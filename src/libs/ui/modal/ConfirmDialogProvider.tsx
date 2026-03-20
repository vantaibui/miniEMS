/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { UiConfirmDialog } from './UiConfirmDialog';

import type { UiConfirmDialogProps } from './UiConfirmDialog.types';

type ConfirmOptions = Omit<UiConfirmDialogProps, 'isOpen' | 'onClose'>;

interface ConfirmDialogContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

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

export function useDialogConfirm() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      'useDialogConfirm must be used within a ConfirmDialogProvider',
    );
  }
  return context.confirm;
}
