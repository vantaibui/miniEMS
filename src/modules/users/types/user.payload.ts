export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  roleId: number;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  roleId?: number;
  status?: string;
}
