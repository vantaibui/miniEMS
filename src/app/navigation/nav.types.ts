import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Breadcrumbs                                                       */
/* ------------------------------------------------------------------ */

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/* ------------------------------------------------------------------ */
/*  Header tabs                                                       */
/* ------------------------------------------------------------------ */

export type TabItem = {
  label: string;
  path: string;
};

export type TabGroup = {
  matchPrefix: string;
  tabs: Array<TabItem>;
};

/* ------------------------------------------------------------------ */
/*  Sidebar                                                           */
/* ------------------------------------------------------------------ */

export type NavPermission = {
  subModule: string;
  action?: 'create' | 'read' | 'update' | 'delete';
};

export type TabNavItem = {
  key: string;
  label: string;
  to: string;
  permission?: NavPermission;
};

export type SidebarTopItem = {
  key: string;
  label: string;
  icon: ReactNode;
  to?: string;
  pathPrefixes: Array<string>;
  tabs?: Array<TabNavItem>;
  permission?: NavPermission;
  permissionAnyOf?: Array<NavPermission>;
};
