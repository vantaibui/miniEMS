import type { ReactNode } from 'react';

export interface UiFormFieldProps {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}
