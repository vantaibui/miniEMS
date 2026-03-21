import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { SIDEBAR_NAV, type SidebarTopItem } from '@app/navigation';

import { Sidebar } from './components/Sidebar';

export interface RootLayoutProps {
  sidebarWidth?: number;
  sidebarItems?: Array<SidebarTopItem>;
}

export const RootLayout = ({
  sidebarWidth = 100,
  sidebarItems = SIDEBAR_NAV,
}: RootLayoutProps) => (
  <Box className="flex h-screen overflow-hidden bg-surface-page">
    <Sidebar width={sidebarWidth} items={sidebarItems} />

    <Box
      component="main"
      className="min-h-0 min-w-0 flex-1 overflow-auto bg-surface-page"
    >
      <Outlet />
    </Box>
  </Box>
);
