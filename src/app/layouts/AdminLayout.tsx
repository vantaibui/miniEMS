import { AppShellLayout } from './shell';
import { NAV_MANAGEMENT } from '../navigation/nav.config';
import { SidebarNav } from './shell/components/SidebarNav';

/**
 * AdminLayout provides the administrative application shell with management navigation.
 * It is used for user, role, and asset management routes.
 */
export const AdminLayout = () => {
  return (
    <AppShellLayout sidebarContent={<SidebarNav groups={NAV_MANAGEMENT} />} />
  );
};
