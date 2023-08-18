import { Request, Response, NextFunction, RequestHandler } from "express";
import catchAsync from "../utils/catch";
import * as AuthLogic from "../logic/auth.logic";

/**
 *  Signup
 *
 */
export const signup: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { jwt, insertId } = await AuthLogic.signup(req.body);

    // attache jwt cookie
    const expires = sendToken(jwt, res);

    res.status(200).json({
      status: "success",
      data: {
        user: { id: insertId, ...req.body },
        accessToken: jwt,
        expires,
      },
    });
  }
);

/**
 *  Signin
 *
 */
export const signin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // signin
    const { jwt, user } = await AuthLogic.signin(
      req.body.email,
      req.body.password
    );

    // attache access token cookie
    const expires = sendToken(jwt, res);

    const { password, ...userDto } = user;

    res.status(200).json({
      status: "success",
      data: {
        user: userDto,
        accessToken: jwt,
        expires,
      },
    });
  }
);

/**
 *  Signout
 *
 */
export const signout = catchAsync(async (req: Request, res: Response) => {
  // overide jwt auth cookie
  sendToken("loggedout", res);

  res.status(200).json({ status: "success" });
});

/**
 *  Send token
 *
 *  send access token via cookie
 *
 * @param token string
 * @param res Response
 */
const sendToken = (token: string, res: Response) => {
  const expires = new Date(
    Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 60 * 1000
  );

  res.cookie("accessToken", token, {
    expires,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("accessTokenExpires", String(expires), {
    expires,
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });

  return expires;
};
