import type { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

import { UiBreadcrumb } from '@libs/ui';

export interface HeaderProps {
  title: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  description?: string;
  actions?: ReactNode;
}

export const Header = ({
  title,
  breadcrumbs,
  description,
  actions,
}: HeaderProps) => {
  return (
    <Box className="sticky top-0 z-10 shrink-0 border-b border-divider bg-surface-card px-6 py-4">
      <UiBreadcrumb items={breadcrumbs} />

      <Box className="mt-1 flex items-center justify-between gap-4">
        <Box className="min-w-0">
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 0.5 }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {actions && (
          <Box className="flex shrink-0 items-center gap-2">{actions}</Box>
        )}
      </Box>
    </Box>
  );
};
