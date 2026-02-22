import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Header height={headerHeight} sidebarWidth={sidebarWidth} />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Sidebar width={sidebarWidth}>{sidebarContent}</Sidebar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'auto',
            bgcolor: '#F7FAFC',
            p: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
