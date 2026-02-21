import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { cn } from '../utils/cn';
import type { UiSelectOptionValue, UiSelectProps } from './UiSelect.types';

function isEmptyValue(value: UiSelectOptionValue | undefined) {
  return value === undefined || value === '';
}

export function UiSelect({
  label,
  helperText,
  errorText,
  required,
  size = 'md',
  fullWidth = true,
  disabled,
  loading,
  placeholder,
  className,
  name,
  value,
  defaultValue,
  onChange,
  options,
  children,
  'aria-label': ariaLabel,
}: UiSelectProps) {
  const showError = Boolean(errorText);
  const isDisabled = Boolean(disabled || loading);

  const labelId = label ? `${name ?? 'ui-select'}-label` : undefined;

  const handleChange = (event: unknown) => {
    const nextValue = (event as { target: { value: UiSelectOptionValue } }).target.value;
    onChange?.(nextValue);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      disabled={isDisabled}
      error={showError}
      size={size === 'sm' ? 'small' : 'medium'}
      className={cn(className)}
    >
      {label ? <InputLabel id={labelId}>{label}</InputLabel> : null}

      <Select
        labelId={labelId}
        label={label ? String(label) : undefined}
        name={name}
        value={value as unknown as string | number | '' | undefined}
        defaultValue={defaultValue as unknown as string | number | '' | undefined}

        onChange={handleChange}
        displayEmpty={Boolean(placeholder)}
        inputProps={{ 'aria-label': ariaLabel }}
        endAdornment={
          loading ? (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <CircularProgress size={16} color="inherit" />
            </InputAdornment>
          ) : undefined
        }
        renderValue={(selected) => {
          if (placeholder && isEmptyValue(selected as UiSelectOptionValue | undefined)) {
            return (
              <Typography component="span" variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            );
          }
          return undefined;
        }}
      >
        {placeholder ? (
          <MenuItem value="" disabled>
            <Typography variant="body2" color="text.secondary">
              {placeholder}
            </Typography>
          </MenuItem>
        ) : null}
        {options
          ? options.map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </MenuItem>
            ))
          : children}
      </Select>

      <FormHelperText>{showError ? errorText : helperText}</FormHelperText>
    </FormControl>
  );
}
