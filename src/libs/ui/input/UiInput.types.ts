import type { ReactNode } from 'react';

export type UiFieldSize = 'sm' | 'md' | 'lg';

export interface UiInputProps {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  size?: UiFieldSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  className?: string;
  passwordToggle?: boolean;

  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];

  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
