export interface UserEntity {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  isActive: boolean;
  roles: Array<string>;
  roleId?: number;
}
