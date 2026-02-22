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
      className="shrink-0 border-r flex flex-col"
      sx={{
        width,
        minWidth: width,
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        className="flex-1 p-4"
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {children || (
          <Typography variant="body2" color="text.secondary">
            No navigation configured.
          </Typography>
        )}
      </Box>

      <Box
        className="p-4"
        sx={{
          flexShrink: 0,
          mt: 'auto',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};
