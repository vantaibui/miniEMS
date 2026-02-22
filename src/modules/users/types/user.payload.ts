export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  department?: string;
  roleId: number;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  department?: string;
  roleId?: number;
  isActive?: boolean;
}
