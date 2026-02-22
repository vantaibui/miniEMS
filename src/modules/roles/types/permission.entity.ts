export interface PermissionActions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface PermissionNode {
  id: number;
  name: string;
  module: string;
  children: Array<PermissionNode>;
  actions: PermissionActions;
}
