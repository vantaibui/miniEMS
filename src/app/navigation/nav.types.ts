import type { ComponentType, ReactNode } from 'react';

export type NavAction = 'create' | 'read' | 'update' | 'delete';

export type NavPermission = {
  /**
   * subModule key – must match `PermissionNode.subModule` from backend.
   * Example: "USER_MANAGEMENT", "ROLE_MANAGEMENT", "DEVICE_MANAGEMENT"
   */
  subModule: string;
  /**
   * action key – defaults to PERMISSION_ACTIONS.READ when omitted.
   */
  action?: NavAction;
};

export type NavItem = {
  key: string;
  label: string;
  to: string;
  icon?: ComponentType<Record<string, unknown>> | ReactNode;
  permission?: NavPermission;
};

export type NavGroup = {
  key: string;
  section: string;
  permission?: NavPermission;
  items: Array<NavItem>;
};

/** Tab item rendered below the header when a sidebar group is active */
export type TabNavItem = {
  key: string;
  label: string;
  to: string;
  permission?: NavPermission;
};

/** Top-level sidebar entry — may link directly or hold child tabs */
export type SidebarTopItem = {
  key: string;
  label: string;
  icon: ReactNode;
  /** Direct route (items without tabs) */
  to?: string;
  /** URL prefixes used to determine whether this item is active */
  pathPrefixes: Array<string>;
  /** Sub-navigation rendered as tabs when this sidebar item is active */
  tabs?: Array<TabNavItem>;
  permission?: NavPermission;
};
