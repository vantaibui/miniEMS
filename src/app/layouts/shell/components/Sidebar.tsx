import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import { Footer } from './Footer';

export interface SidebarNavItem {
  key: string;
  label: string;
  to: string;
  icon?: ReactNode;
}

export interface SidebarNavGroup {
  key: string;
  section?: string;
  items: Array<SidebarNavItem>;
}

interface SidebarProps {
  width?: number;
  children?: ReactNode;
}

export const Sidebar = ({ width = 260, children }: SidebarProps) => {
  return (
    <Box
      component="aside"
      className="hidden shrink-0 border-r border-divider bg-surface-card lg:flex lg:flex-col"
      style={{ width, minWidth: width }}
    >
      <Box className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2">
        {children || (
          <Typography variant="body2" color="text.secondary">
            No navigation configured.
          </Typography>
        )}
      </Box>

      <Box className="mt-auto shrink-0 p-2">
        <Footer />
      </Box>
    </Box>
  );
};
