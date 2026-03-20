export interface PermissionActions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface PermissionNode {
  id: number;
  name: string;
  module: string;
  subModule: string;
  actions: PermissionActions;
}
