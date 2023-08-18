import { execute } from "../data/mysql/db";
import { UsersQueries } from "../data/mysql/queries/users.queries";
import { IUser } from "../models/user.model";
import { AppError } from "../errors/AppError";

/**
 * gets users
 */
export const getUsers = async () => {
  return execute<IUser[]>(UsersQueries.GetUsers, []);
};

/**
 * gets a user based on id provided
 */
export const getUserById = async (id: IUser["id"]) => {
  const result = await execute<IUser[]>(UsersQueries.GetUserById, [id]);
  return result[0];
};

/**
 * gets a user based on email provided
 */
export const getUserByEmail = async (email: string) => {
  const result = await execute<IUser[]>(UsersQueries.getUserByEmail, [email]);
  return result[0];
};

/**
 *  adds a new user record
 */
export const insertUser = async (user: any) => {
  const { insertId } = await execute<{
    affectedRows: number;
    insertId: number;
  }>(UsersQueries.InsertUser, [
    user.firstName,
    user.lastName,
    user.email,
    user.password,
  ]);

  // Return user id
  return insertId;
};

/**
 * updates user's information based on the id provided
 */
export const updateUser = async (user: IUser): Promise<any> => {
  const foundedUser = await execute<IUser[]>(UsersQueries.GetUserById, [
    user.id,
  ]);

  if (!foundedUser) throw new AppError("User not found", 403);

  const updatedUser = Object.assign(foundedUser, user);

  const result = await execute<{ affectedRows: number }>(
    UsersQueries.UpdateUserById,
    [
      updatedUser.id,
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.email,
      updatedUser.password,
      updatedUser.role,
    ]
  );

  // Return true or false for success
  return result.affectedRows > 0;
};
