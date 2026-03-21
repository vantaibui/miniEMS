import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';

import { PERMISSION_SUBMODULES } from '@modules/auth';

import type { SidebarTopItem, TabGroup } from './nav.types';

/* ------------------------------------------------------------------ */
/*  Sidebar items                                                     */
/* ------------------------------------------------------------------ */

export const SIDEBAR_NAV: Array<SidebarTopItem> = [
  {
    key: 'admin',
    label: 'Admin',
    icon: <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 24 }} />,
    to: '/admin/users',
    pathPrefixes: ['/admin'],
    permissionAnyOf: [
      {
        subModule: PERMISSION_SUBMODULES.USER_MANAGEMENT,
        action: 'read',
      },
      {
        subModule: PERMISSION_SUBMODULES.ROLE_MANAGEMENT,
        action: 'read',
      },
    ],
  },
  {
    key: 'devices',
    label: 'Devices',
    icon: <DevicesOtherOutlinedIcon sx={{ fontSize: 24 }} />,
    to: '/devices',
    pathPrefixes: ['/devices'],
    permission: {
      subModule: PERMISSION_SUBMODULES.DEVICE_MANAGEMENT,
      action: 'read',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Header tabs (labels must stay aligned with breadcrumbs.ts)        */
/* ------------------------------------------------------------------ */

export const TAB_GROUPS: Array<TabGroup> = [
  {
    matchPrefix: '/admin',
    tabs: [
      { label: 'User Management', path: '/admin/users' },
      { label: 'Role Management', path: '/admin/roles' },
    ],
  },
  {
    matchPrefix: '/devices',
    tabs: [{ label: 'Device Management', path: '/devices' }],
  },
];

/* ------------------------------------------------------------------ */
/*  Document title                                                    */
/* ------------------------------------------------------------------ */

export const DOCUMENT_TITLE_SUFFIX = 'miniEMS';
