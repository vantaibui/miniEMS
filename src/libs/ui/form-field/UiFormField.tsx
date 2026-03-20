import { Box } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

import { cn } from '@libs/utils';

import type { UiFormFieldProps } from './UiFormField.types';

export function UiFormField({
  label,
  helperText,
  errorText,
  required,
  disabled,
  children,
  className,
}: UiFormFieldProps) {
  const showError = Boolean(errorText);

  return (
    <Box className={cn('flex min-w-0 flex-col gap-1', className)}>
      {label ? (
        <Typography
          component="label"
          variant="body2"
          color={disabled ? 'text.disabled' : 'text.secondary'}
        >
          {label}
          {required ? (
            <Typography component="span" color="error" aria-hidden>
              {' *'}
            </Typography>
          ) : null}
        </Typography>
      ) : null}

      <Box className="min-w-0">{children}</Box>

      {showError || helperText ? (
        <FormHelperText error={showError} disabled={disabled} sx={{ m: 0 }}>
          {showError ? errorText : helperText}
        </FormHelperText>
      ) : null}
    </Box>
  );
}
