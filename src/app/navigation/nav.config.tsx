import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
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
    permissionPath: 'ACCESS_MANAGEMENT.read',
    items: [
      {
        key: 'users',
        label: 'User Management',
        to: '/users',
        icon: <PeopleAltOutlinedIcon fontSize="small" />,
        permissionPath: 'ACCESS_MANAGEMENT.USER_MANAGEMENT.read',
      },
      {
        key: 'roles',
        label: 'Roles & Permissions',
        to: '/roles',
        icon: <SecurityOutlinedIcon fontSize="small" />,
        permissionPath: 'ACCESS_MANAGEMENT.ROLE_MANAGEMENT.read',
      },
    ],
  },
];

export const NAV_ASSET: Array<NavGroup> = [
  {
    key: 'asset',
    section: 'ASSET MANAGEMENT',
    permissionPath: 'ASSET_MANAGEMENT.read',
    items: [
      {
        key: 'device_inventory',
        label: 'Device Inventory',
        to: '/device-inventory',
        icon: <PeopleAltOutlinedIcon fontSize="small" />,
        permissionPath: 'ASSET_MANAGEMENT.DEVICE_INVENTORY.read',
      },
      {
        key: 'device_configuration',
        label: 'Device Configuration',
        to: '/device-configuration',
        icon: <SecurityOutlinedIcon fontSize="small" />,
        permissionPath: 'ASSET_MANAGEMENT.DEVICE_CONFIGURATION.read',
      },
    ],
  },
];

export const NAV_MANAGEMENT: Array<NavGroup> = [
  ...NAV_MAIN,
  ...NAV_ACCESS,
  ...NAV_ASSET,
];
