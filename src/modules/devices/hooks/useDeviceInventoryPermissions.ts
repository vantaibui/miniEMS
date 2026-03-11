import {
  PERMISSION_ACTIONS,
  PERMISSION_SUBMODULES,
  usePermission,
} from '@modules/auth';

export const useDeviceInventoryPermissions = () => {
  const subModuleKey = PERMISSION_SUBMODULES.DEVICE_MANAGEMENT;

  return {
    canView: usePermission(subModuleKey, PERMISSION_ACTIONS.READ),
    canCreate: usePermission(subModuleKey, PERMISSION_ACTIONS.CREATE),
    canEdit: usePermission(subModuleKey, PERMISSION_ACTIONS.UPDATE),
    canDelete: usePermission(subModuleKey, PERMISSION_ACTIONS.DELETE),
  };
};
