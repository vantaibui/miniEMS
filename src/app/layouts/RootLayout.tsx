import { AppShellLayout } from './shell';
import { SidebarNav } from './shell/components/SidebarNav';
import { NAV_MAIN } from '../navigation/nav.config';

/**
 * RootLayout provides the main application shell with the default navigation.
 * It is used for the primary authenticated routes of the application.
 */
export const RootLayout = () => {
  return <AppShellLayout sidebarContent={<SidebarNav groups={NAV_MAIN} />} />;
};
