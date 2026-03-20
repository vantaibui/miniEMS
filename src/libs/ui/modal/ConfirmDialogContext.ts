import { createContext } from 'react';

import type { UiConfirmDialogProps } from './UiConfirmDialog.types';

type ConfirmOptions = Omit<UiConfirmDialogProps, 'isOpen' | 'onClose'>;

export interface ConfirmDialogContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);
