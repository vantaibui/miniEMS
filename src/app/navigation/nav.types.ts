import type { ComponentType, ReactNode } from 'react';

export type NavItem = {
  key: string;
  label: string;
  to: string;
  icon?: ComponentType<Record<string, unknown>> | ReactNode;
  permissionPath?: string; // Raw traversal path: "MODULE.SUBMODULE.action"
};

export type NavGroup = {
  key: string;
  section: string;
  permissionPath?: string; // Raw traversal path: "MODULE.action"
  items: Array<NavItem>;
};
