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
    items: [
      {
        key: 'users',
        label: 'User Management',
        to: '/admin/users',
        icon: <PeopleAltOutlinedIcon fontSize="small" />,
        permissionPath: 'ACCESS_MANAGEMENT.USER_MANAGEMENT.read',
      },
      {
        key: 'roles',
        label: 'Roles & Permissions',
        to: '/admin/roles',
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
    items: [
      {
        key: 'device_inventory',
        label: 'Device Inventory',
        to: '/admin/device-inventory',
        icon: <PeopleAltOutlinedIcon fontSize="small" />,
        permissionPath: 'ASSET_MANAGEMENT.DEVICE_INVENTORY.read',
      },
      {
        key: 'device_configuration',
        label: 'Device Configuration',
        to: '/admin/device-configuration',
        icon: <SecurityOutlinedIcon fontSize="small" />,
        permissionPath: 'ASSET_MANAGEMENT.DEVICE_CONFIGURATION.read',
      },
    ],
  },
];

export const NAV_MANAGEMENT: Array<NavGroup> = [...NAV_ACCESS, ...NAV_ASSET];
