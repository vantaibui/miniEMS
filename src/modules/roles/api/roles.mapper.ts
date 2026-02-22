import type {
  PermissionNode,
  PermissionNodeDto,
  RoleDetailDto,
  RoleDetailEntity,
  RoleDto,
  RoleEntity,
} from '../types';

export const mapPermissionNodeDtoToEntity = (
  dto: PermissionNodeDto,
): PermissionNode => ({
  id: dto.id,
  name: dto.name,
  module: dto.module,
  children: (dto.subModule ?? []).map(mapPermissionNodeDtoToEntity),
  actions: {
    canCreate: dto.actions.create,
    canRead: dto.actions.read,
    canUpdate: dto.actions.update,
    canDelete: dto.actions.delete,
  },
});

export const mapRoleDtoToEntity = (dto: RoleDto): RoleEntity => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  status: dto.status,
  createdDate: dto.createdDate,
  createdById: dto.createdById,
  lastModifiedDate: dto.lastModifiedDate,
  lastModifiedBy: dto.lastModifiedBy,
});

export const mapRoleDetailDtoToEntity = (
  dto: RoleDetailDto,
): RoleDetailEntity => ({
  ...mapRoleDtoToEntity(dto),
  permissions: dto.permissions.map((p) => ({
    module: p.module,
    actions: {
      canCreate: p.actions.create,
      canRead: p.actions.read,
      canUpdate: p.actions.update,
      canDelete: p.actions.delete,
    },
  })),
});

export const mapCreateRolePayloadToDto = (payload: {
  name: string;
  description: string;
  permissions: Array<{ id: number; actions: PermissionNodeDto['actions'] }>;
}) => ({
  name: payload.name,
  description: payload.description,
  permissions: payload.permissions,
});

export const mapUpdateRolePayloadToDto = mapCreateRolePayloadToDto;
