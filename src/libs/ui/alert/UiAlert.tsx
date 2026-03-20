import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';

import { cn } from '../utils/cn';

import type { UiAlertProps } from './UiAlert.types';

export function UiAlert({
  children,
  severity = 'info',
  variant = 'standard',
  title,
  onClose,
  className,
  icon,
  closeIcon,
}: UiAlertProps) {
  const defaultCloseIcon = <span aria-hidden>×</span>;

  return (
    <MuiAlert
      severity={severity}
      variant={variant}
      icon={icon}
      className={cn(className)}
      action={
        onClose ? (
          <IconButton size="small" aria-label="Close alert" onClick={onClose}>
            {closeIcon ?? defaultCloseIcon}
          </IconButton>
        ) : undefined
      }
    >
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {children}
    </MuiAlert>
  );
}
