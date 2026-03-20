import type { ReactNode } from 'react';

import { Box, Typography } from '@mui/material';

import assets from '@/libs/assets';

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

export const Sidebar = ({ width = 56, children }: SidebarProps) => {
  return (
    <Box
      component="aside"
      className="flex shrink-0 flex-col bg-primary text-primary-contrast"
      style={{ width, minWidth: width }}
    >
      <Box
        className="flex h-14 items-center justify-center border-b px-1"
        sx={{ borderColor: 'primary.dark' }}
      >
        <Box
          component="img"
          src={assets.svgs.miniEMSSvg}
          alt="miniEMS"
          className="h-6 w-6"
        />
      </Box>

      <Box className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-2">
        {children || (
          <Typography variant="body2" color="inherit">
            No navigation configured.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
