import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';

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
  passwordToggle = false,
  type,
  ...rest
}: UiInputProps) {
  const muiSize = mapSize(size);
  const showError = Boolean(errorText);
  const isDisabled = Boolean(disabled || loading);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const shouldShowToggle = passwordToggle && isPasswordType && !loading;

  const effectiveType = shouldShowToggle ? (showPassword ? 'text' : 'password') : type;

  const slotProps: TextFieldProps['slotProps'] = {
    input: {
      startAdornment: startAdornment ? (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      ) : undefined,
      endAdornment: loading ? (
        <InputAdornment position="end">
          <CircularProgress size={16} color="inherit" />
        </InputAdornment>
      ) : shouldShowToggle ? (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            sx={{ color: 'text.secondary' }}
          >
            {showPassword ? (
              <VisibilityOffIcon fontSize="small" />
            ) : (
              <VisibilityIcon fontSize="small" />
            )}
          </IconButton>
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
      type={effectiveType}
      {...rest}
    />
  );
}
