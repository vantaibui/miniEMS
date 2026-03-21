import type { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { getBreadcrumbItems } from '@app/navigation';

import { UiBreadcrumb } from '@libs/ui';


import { TabsNav } from './TabsNav';

export interface HeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const Header = ({ title, description, actions }: HeaderProps) => {
  const { pathname } = useLocation();
  const breadcrumbItems = getBreadcrumbItems(pathname);

  return (
    <Box className="sticky top-0 z-10 shrink-0 border-b border-divider bg-surface-card px-6">
      <UiBreadcrumb items={breadcrumbItems} />

      <Box className="py-2 flex items-center justify-between gap-4">
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

      <TabsNav />
    </Box>
  );
};
