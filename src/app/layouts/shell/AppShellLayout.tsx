import type { ReactNode } from 'react';

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

interface AppShellLayoutProps {
  sidebarWidth?: number;
  headerHeight?: number;
  sidebarContent?: ReactNode;
  title?: string;
}

export const AppShellLayout = ({
  sidebarWidth = 56,
  headerHeight = 56,
  sidebarContent,
  title = 'ADMINISTRATION',
}: AppShellLayoutProps) => {
  return (
    <Box className="flex h-screen overflow-hidden bg-surface-page">
      <Sidebar width={sidebarWidth}>{sidebarContent}</Sidebar>

      <Box className="flex min-w-0 flex-1 flex-col">
        <Header height={headerHeight} title={title} />

        <Box
          component="main"
          className="min-h-0 min-w-0 flex-1 overflow-auto bg-surface-page p-3 md:p-4"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
