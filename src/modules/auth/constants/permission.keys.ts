import {
  PERMISSION_ACTIONS,
  type PermissionAction,
} from './permissions.constants';

/**
 * Centralized registry of permission subModules used across the app.
 * These values must match `PermissionNode.subModule` returned by the backend.
 */
export const PERMISSION_SUBMODULES = {
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  ROLE_MANAGEMENT: 'ROLE_MANAGEMENT',

  DEVICE_MANAGEMENT: 'DEVICE_MANAGEMENT',
  DEVICE_CONFIGURATION: 'DEVICE_CONFIGURATION',
} as const;

export type PermissionSubModule =
  (typeof PERMISSION_SUBMODULES)[keyof typeof PERMISSION_SUBMODULES];

/**
 * Helper to build a raw permission path in the format: "SUB_MODULE.ACTION"
 * Example: makePermissionPath('USER_MANAGEMENT', 'read') -> "USER_MANAGEMENT.read"
 */
export const makePermissionPath = (
  subModuleKey: PermissionSubModule | string,
  actionKey: PermissionAction = PERMISSION_ACTIONS.READ,
) => `${subModuleKey}.${actionKey}`;
