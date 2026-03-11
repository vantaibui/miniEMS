import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

interface AppShellLayoutProps {
  sidebarWidth?: number;
  headerHeight?: number;
  sidebarContent?: ReactNode;
}

export const AppShellLayout = ({
  sidebarWidth = 260,
  headerHeight = 64,
  sidebarContent,
}: AppShellLayoutProps) => {
  return (
    <Box className="flex h-screen flex-col overflow-hidden bg-surface-page">
      <Header height={headerHeight} sidebarWidth={sidebarWidth} />

      <Box className="flex min-h-0 flex-1 border-t border-divider">
        <Sidebar width={sidebarWidth}>{sidebarContent}</Sidebar>

        <Box
          component="main"
          className="min-h-0 min-w-0 flex-1 overflow-auto bg-surface-page p-2 md:p-3"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
