import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

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
  headerHeight?: number;
  children?: ReactNode;
}

export const Sidebar = ({ width = 260, headerHeight = 64, children }: SidebarProps) => {
  return (
    <Box
      component="aside"
      className="shrink-0 border-r flex flex-col"
      sx={{
        width,
        height: `calc(100vh - ${headerHeight}px)`,
        position: 'sticky',
        top: headerHeight,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box className="flex-1 p-4 overflow-auto">
        {children || (
          <Typography variant="body2" color="text.secondary">
            No navigation configured.
          </Typography>
        )}
      </Box>

      <Box className="p-4 mt-auto">
        <Footer />
      </Box>
    </Box>
  );
};
