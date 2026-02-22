export interface UserDto {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  active?: boolean;
  status?: string;
  roles?: Array<string>;
  roleId?: number;
}
