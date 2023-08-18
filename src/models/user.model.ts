export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}
