import type { ReactNode } from 'react';

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './components/Sidebar';

interface AppShellLayoutProps {
  sidebarWidth?: number;
  sidebarContent?: ReactNode;
}

export const AppShellLayout = ({
  sidebarWidth = 72,
  sidebarContent,
}: AppShellLayoutProps) => {
  return (
    <Box className="flex h-screen overflow-hidden bg-surface-page">
      <Sidebar width={sidebarWidth}>{sidebarContent}</Sidebar>

      <Box
        component="main"
        className="min-h-0 min-w-0 flex-1 overflow-auto bg-surface-page"
      >
        <Outlet />
      </Box>
    </Box>
  );
};
