export interface PermissionActionsDto {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface PermissionNodeDto {
  id: number;
  name: string;
  module: string;
  subModule: Array<PermissionNodeDto> | null;
  actions: PermissionActionsDto;
}
