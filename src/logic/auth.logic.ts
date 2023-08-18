import { getUserByEmail, insertUser } from "./users.logic";
import { compareHash, hash } from "../utils/passwords";
import { generateToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import { IUser } from "../models/user.model";

/**
 *  signup
 */

export const signup = async (user: IUser): Promise<any> => {
  const userExists = await getUserByEmail(user.email);
  if (userExists) {
    throw new AppError("This email is already in use", 401);
  }

  const hashedPass = await hash(user.password);
  user.password = hashedPass;
  const insertId = await insertUser(user);
  const jwt = generateToken(insertId);

  return { insertId, jwt };
};

/**
 *  signin
 */

export const signin = async (email: string, password: string): Promise<any> => {
  //
  const user = await getUserByEmail(email);
  // No user found ? means email was wrong
  if (!user) {
    throw new AppError("Credentials incorrect", 400);
  }

  // Compare between the saved password to the incoming password,
  const isPasswordCorrect = await compareHash(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Credentials incorrect", 400);
  }

  const jwt = generateToken(user.id);
  return { user, jwt };
};
