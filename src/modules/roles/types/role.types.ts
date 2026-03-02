export type RoleStatus = 'ACTIVE' | 'INACTIVE';

export interface Role {
  id: number;
  name: string;
  description: string;
  status: RoleStatus;
  createdDate: string;
  createdById: number;
  lastModifiedDate: string;
  lastModifiedBy: number;
}

export interface RolePermissionModule {
  module: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface RoleDetails extends Role{
  permissions: Array<RolePermissionModule>;
}
