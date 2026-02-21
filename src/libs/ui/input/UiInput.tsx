import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

import { cn } from '../utils/cn';
import type { UiFieldSize, UiInputProps } from './UiInput.types';

function mapSize(size: UiFieldSize): 'small' | 'medium' {
  switch (size) {
    case 'sm':
      return 'small';
    case 'md':
      return 'medium';
    case 'lg':
      return 'medium';
    default:
      return 'medium';
  }
}

export function UiInput({
  label,
  helperText,
  errorText,
  required,
  size = 'md',
  fullWidth = true,
  disabled,
  loading,
  startAdornment,
  endAdornment,
  className,
  ...rest
}: UiInputProps) {
  const muiSize = mapSize(size);
  const showError = Boolean(errorText);
  const isDisabled = Boolean(disabled || loading);

  const slotProps: TextFieldProps['slotProps'] = {
    input: {
      startAdornment: startAdornment ? (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      ) : undefined,
      endAdornment: loading ? (
        <InputAdornment position="end">
          <CircularProgress size={16} color="inherit" />
        </InputAdornment>
      ) : endAdornment ? (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
      ) : undefined,
    },
  };

  return (
    <TextField
      label={label}
      required={required}
      size={muiSize}
      fullWidth={fullWidth}
      disabled={isDisabled}
      error={showError}
      helperText={showError ? errorText : helperText}
      className={cn(className)}
      slotProps={slotProps}
      {...rest}
    />
  );
}
