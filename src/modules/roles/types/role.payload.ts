import type { PermissionActions } from './permission.dto';

export interface RolePermissionPayload {
  id: number;
  actions: PermissionActions;
}

export interface BaseRolePayload {
  name: string;
  description: string;
  permissions: Array<RolePermissionPayload>;
}

export type CreateRolePayload = BaseRolePayload;
export type UpdateRolePayload = BaseRolePayload;
