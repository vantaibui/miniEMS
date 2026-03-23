import type { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { getBreadcrumbItems } from '@app/navigation';

import { UiBreadcrumb } from '@libs/ui';


import { TabsNav } from './TabsNav';

export interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export const Header = ({ title, actions }: HeaderProps) => {
  const { pathname } = useLocation();
  const breadcrumbItems = getBreadcrumbItems(pathname);

  return (
    <Box className="sticky top-0 z-10 shrink-0 border-b border-divider bg-surface-card px-6">
      <Box className="flex min-h-8 items-center pt-2">
        <UiBreadcrumb items={breadcrumbItems} />
      </Box>

      <Box className="flex min-h-14 items-center justify-between gap-4 py-2">
        <Box className="min-w-0">
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            {title}
          </Typography>
        </Box>

        {actions && (
          <Box className="flex shrink-0 items-center gap-2">{actions}</Box>
        )}
      </Box>

      <TabsNav />
    </Box>
  );
};
