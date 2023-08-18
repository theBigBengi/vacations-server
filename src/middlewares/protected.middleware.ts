import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { getUserById } from "../logic/users.logic";
import { verifyToken } from "../utils/jwt";
import catchAsync from "../utils/catch";
import { IUser, Role } from "../models/user.model";

/**
 *  protect routes
 *  we modify the default behavior (USER) access level by passing a another role
 *
 */

const protectedRoutes = (accessLevel?: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there

    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    console.log({ token });
    if (!token) {
      return next(new AppError("Please log in to continue", 401));
      // return res.redirect("/api/v1/users");
    }

    // 2) Verify token
    const { userId } = await verifyToken(token);

    // 3) Check if user still exists
    const currentUser: IUser | null = await getUserById(userId);

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) Check if admin access is required
    if (accessLevel === Role.ADMIN && currentUser.role !== Role.ADMIN) {
      return next(new AppError("Unauthorized", 401));
    }

    // we can add more access level...

    // Grant access to protected routes
    req.user = currentUser;
    next();
  });

export default protectedRoutes;
