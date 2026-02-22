import type { UserDto } from '../types/user.dto';
import type { UserEntity } from '../types/user.entity';
import type {
  CreateUserPayload,
  UpdateUserPayload,
} from '../types/user.payload';

export const mapUserDtoToEntity = (dto: UserDto): UserEntity => {
  const firstName = dto.firstName || dto.first_name || '';
  const lastName = dto.lastName || dto.last_name || '';
  const computedFullName = `${firstName} ${lastName}`.trim();

  // Create mock role array from roleId if roles is absent, for UI display
  const derivedRoles =
    dto.roles ||
    (dto.roleId ? [dto.roleId === 1 ? 'Super Admin' : 'Viewer'] : []);

  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    firstName,
    lastName,
    fullName: dto.fullName || computedFullName,
    isActive: dto.active !== undefined ? dto.active : dto.status === 'ACTIVE',
    roles: derivedRoles,
    roleId: dto.roleId,
  };
};

export const mapUserEntityToCreateDto = (payload: CreateUserPayload) => {
  return {
    username: payload.username,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    password: 'Passw0rd!',
    roleId: payload.roleId,
  };
};

export const mapUserEntityToUpdateDto = (payload: UpdateUserPayload) => ({
  ...(payload.firstName && { firstName: payload.firstName }),
  ...(payload.lastName && { lastName: payload.lastName }),
  ...(payload.username && { username: payload.username }),
  ...(payload.email && { email: payload.email }),
  ...(payload.roleId && { roleId: payload.roleId }),
  ...(typeof payload.isActive === 'boolean' && { active: payload.isActive }),
});
