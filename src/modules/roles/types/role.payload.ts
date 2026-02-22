import type { PermissionActionsDto } from './permission.dto';

export interface RolePermissionPayload {
  id: number;
  actions: PermissionActionsDto;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: Array<RolePermissionPayload>;
}

export interface UpdateRolePayload {
  name: string;
  description: string;
  permissions: Array<RolePermissionPayload>;
}
