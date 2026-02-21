import type { ReactNode } from 'react';

import type { UiFieldSize } from '../input/UiInput.types';

export type UiSelectOptionValue = string | number;

export interface UiSelectOption {
  value: UiSelectOptionValue;
  label: ReactNode;
  disabled?: boolean;
}

export interface UiSelectProps {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  size?: UiFieldSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: ReactNode;
  className?: string;

  name?: string;
  value?: UiSelectOptionValue;
  defaultValue?: UiSelectOptionValue;
  onChange?: (value: UiSelectOptionValue) => void;

  options?: Array<UiSelectOption>;
  children?: ReactNode;
  'aria-label'?: string;
}
