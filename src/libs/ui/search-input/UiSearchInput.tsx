import { IconButton, CloseIcon, SearchIcon } from '@libs/ui';
import { cn } from '@libs/utils';
import { UiInput } from '../input';
import type { UiSearchInputProps } from './UiSearchInput.types';

export function UiSearchInput({
  value,
  onChange,
  placeholder,
  disabled,
  loading,
  onClear,
  startIcon = <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />,
  clearIcon = <CloseIcon fontSize="small" />,
  className,
  'aria-label': ariaLabel,
}: UiSearchInputProps) {
  const showClear = Boolean(onClear) && value.length > 0 && !disabled && !loading;

  return (
    <UiInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      loading={loading}
      startAdornment={startIcon}
      endAdornment={
        showClear ? (
          <IconButton
            size="small"
            onClick={onClear}
            aria-label="Clear search"
            edge="end"
            tabIndex={-1}
          >
            {clearIcon}
          </IconButton>
        ) : undefined
      }
      className={cn(className)}
      aria-label={ariaLabel}
    />
  );
}
