import { AppShellLayout } from './shell';
import { SidebarNav } from './shell/components/SidebarNav';
import { NAV_MANAGEMENT } from '../navigation/nav.config';

/**
 * AdminLayout provides the administrative application shell with management navigation.
 * It is used for user, role, and asset management routes.
 */
export const AdminLayout = () => {
  return (
    <AppShellLayout sidebarContent={<SidebarNav groups={NAV_MANAGEMENT} />} />
  );
};
