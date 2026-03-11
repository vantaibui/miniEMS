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
