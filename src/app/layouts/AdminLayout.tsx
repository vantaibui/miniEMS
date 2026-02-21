import { AppShellLayout } from './shell';
import { SidebarNav } from './shell/components/SidebarNav';
import { NAV_MANAGEMENT } from '../navigation/nav.config';

export const AdminLayout = () => {
  return (
    <AppShellLayout
      sidebarContent={<SidebarNav groups={NAV_MANAGEMENT} />}
    />
  );
};
