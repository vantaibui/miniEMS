import { SIDEBAR_NAV } from '../navigation/nav.config';
import { AppShellLayout } from './shell';
import { SidebarNav } from './shell/components/SidebarNav';

export const AdminLayout = () => {
  return (
    <AppShellLayout
      sidebarWidth={100}
      sidebarContent={<SidebarNav items={SIDEBAR_NAV} />}
    />
  );
};
