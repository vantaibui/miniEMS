import { Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import type { PermissionNode } from '@libs/types';

import { hasPermission, useRbacStore } from '@modules/auth';

import type {
  NavPermission,
  SidebarTopItem,
} from '../../../navigation/nav.types';

interface TabsNavProps {
  sidebarItems: Array<SidebarTopItem>;
}

const isAllowed = (
  permissions: Array<PermissionNode> | null,
  permission?: NavPermission,
) => {
  if (!permission) return true;
  return hasPermission(permissions, permission.subModule, permission.action ?? 'read');
};

export const TabsNav = ({ sidebarItems }: TabsNavProps) => {
  const permissions = useRbacStore((s) => s.permissions);
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = sidebarItems.find((item) =>
    item.pathPrefixes.some(
      (prefix) =>
        location.pathname === prefix ||
        location.pathname.startsWith(`${prefix}/`),
    ),
  );

  if (!activeItem?.tabs || activeItem.tabs.length === 0) return null;

  const visibleTabs = activeItem.tabs.filter((tab) =>
    isAllowed(permissions, tab.permission),
  );

  if (visibleTabs.length === 0) return null;

  const activeTabIndex = visibleTabs.findIndex((tab) =>
    location.pathname === tab.to ||
    location.pathname.startsWith(`${tab.to}/`),
  );

  return (
    <Tabs
      value={activeTabIndex >= 0 ? activeTabIndex : false}
      onChange={(_, newValue: number) => {
        const tab = visibleTabs[newValue];
        if (tab) navigate(tab.to);
      }}
      className="shrink-0 bg-surface-card px-4 md:px-5"
    >
      {visibleTabs.map((tab) => (
        <Tab key={tab.key} label={tab.label} />
      ))}
    </Tabs>
  );
};
