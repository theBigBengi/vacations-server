import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

/**
 *  verify jwt token
 *
 * @param token
 * @returns userId
 */
export const verifyToken = (token: string) => {
  return new Promise<{ userId: number }>((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

/**
 * generate & sign jwt token
 *
 * @param user :User
 * @returns token :string
 */
export const generateToken = (userId: IUser["id"]) => {
  const payload = { userId };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
