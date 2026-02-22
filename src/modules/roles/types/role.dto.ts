export interface RoleDto {
  id: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;
  createdById: number;
  lastModifiedDate: string;
  lastModifiedBy: number;
}

export interface RolePermissionModuleDto {
  module: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

export interface RoleDetailDto extends RoleDto {
  permissions: Array<RolePermissionModuleDto>;
}
