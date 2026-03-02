import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { PERMISSION_SUBMODULES } from '@modules/auth';
import type { NavGroup } from './nav.types';

export const NAV_MAIN: Array<NavGroup> = [
  {
    key: 'main',
    section: 'MAIN NAVIGATION',
    items: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        to: '/dashboard',
        icon: <DashboardOutlinedIcon fontSize="small" />,
      },
      {
        key: 'analytics',
        label: 'Analytics',
        to: '/analytics',
        icon: <AnalyticsOutlinedIcon fontSize="small" />,
      },
    ],
  },
];

export const NAV_ACCESS: Array<NavGroup> = [
  {
    key: 'access',
    section: 'ACCESS MANAGEMENT',
    items: [
      {
        key: 'users',
        label: 'User Management',
        to: '/users',
        icon: <PeopleAltOutlinedIcon fontSize="small" />,
        permission: {
          subModule: PERMISSION_SUBMODULES.USER_MANAGEMENT,
          action: 'read',
        },
      },
      {
        key: 'roles',
        label: 'Roles & Permissions',
        to: '/roles',
        icon: <SecurityOutlinedIcon fontSize="small" />,
        permission: {
          subModule: PERMISSION_SUBMODULES.ROLE_MANAGEMENT,
          action: 'read',
        },
      },
    ],
  },
];

export const NAV_ASSET: Array<NavGroup> = [
  {
    key: 'asset',
    section: 'ASSET MANAGEMENT',
    items: [
      {
        key: 'device_inventory',
        label: 'Device Inventory',
        to: '/device-inventory',
        icon: <PeopleAltOutlinedIcon fontSize="small" />,
        permission: {
          subModule: PERMISSION_SUBMODULES.DEVICE_INVENTORY,
          action: 'read',
        },
      },
      {
        key: 'device_configuration',
        label: 'Device Configuration',
        to: '/device-configuration',
        icon: <SecurityOutlinedIcon fontSize="small" />,
        permission: {
          subModule: PERMISSION_SUBMODULES.DEVICE_CONFIGURATION,
          action: 'read',
        },
      },
    ],
  },
];

export const NAV_MANAGEMENT: Array<NavGroup> = [
  ...NAV_MAIN,
  ...NAV_ACCESS,
  ...NAV_ASSET,
];
