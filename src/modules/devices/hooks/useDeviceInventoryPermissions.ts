import { PERMISSION_ACTIONS } from '@modules/auth/constants/permissions.constants';
import { PERMISSION_SUBMODULES } from '@modules/auth/constants/permission.keys';
import { useHasAction } from '@modules/auth';

export const useDeviceInventoryPermissions = () => {
  const subModule = PERMISSION_SUBMODULES.DEVICE_INVENTORY;

  return {
    canView: useHasAction(subModule, PERMISSION_ACTIONS.READ),
    canCreate: useHasAction(subModule, PERMISSION_ACTIONS.CREATE),
    canEdit: useHasAction(subModule, PERMISSION_ACTIONS.UPDATE),
    canDelete: useHasAction(subModule, PERMISSION_ACTIONS.DELETE),
  };
};

