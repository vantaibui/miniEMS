import { Typography } from '@mui/material';

interface UiStatusBadgeProps {
  status: 'active' | 'inactive';
  activeLabel?: string;
  inactiveLabel?: string;
}

export function UiStatusBadge({
  status,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}: UiStatusBadgeProps) {
  const isActive = status === 'active';

  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={
          isActive
            ? 'h-2 w-2 rounded-full bg-status-active'
            : 'h-2 w-2 rounded-full bg-status-inactive'
        }
      />
      <Typography
        variant="body2"
        color={isActive ? 'text.primary' : 'text.secondary'}
        className="font-semibold"
      >
        {isActive ? activeLabel : inactiveLabel}
      </Typography>
    </span>
  );
}

UiStatusBadge.displayName = 'UiStatusBadge';
