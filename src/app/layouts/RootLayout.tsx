import { AppShellLayout } from './shell';
import { NAV_MANAGEMENT } from '../navigation/nav.config';
import { SidebarNav } from './shell/components/SidebarNav';

/**
 * RootLayout provides the main application shell with the default navigation.
 * It is used for the primary authenticated routes of the application.
 */
export const RootLayout = () => {
  return (
    <AppShellLayout sidebarContent={<SidebarNav groups={NAV_MANAGEMENT} />} />
  );
};
