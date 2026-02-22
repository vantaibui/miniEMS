export type RoleStatus = 'ACTIVE' | 'INACTIVE';

export interface RoleEntity {
  id: number;
  name: string;
  description: string;
  status: RoleStatus;
  createdDate: string;
  createdById: number;
  lastModifiedDate: string;
  lastModifiedBy: number;
}

export interface RolePermissionModuleEntity {
  module: string;
  actions: {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
}

export interface RoleDetailEntity extends RoleEntity {
  permissions: Array<RolePermissionModuleEntity>;
}
