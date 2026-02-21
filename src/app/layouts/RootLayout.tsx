import { AppShellLayout } from './shell';
import { SidebarNav } from './shell/components/SidebarNav';
import { NAV_MAIN } from '../navigation/nav.config';

export const RootLayout = () => {
  return <AppShellLayout sidebarContent={<SidebarNav groups={NAV_MAIN} />} />;
};
