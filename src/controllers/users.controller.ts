import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catch";
import * as usersLogic from "../logic/users.logic";

export const insertUser = catchAsync(
  async (request: Request, response: Response) => {
    const insertId = await usersLogic.insertUser(request.body);

    response.status(201).json({
      status: "success",
      data: {
        insertId,
      },
    });
  }
);

export const getUsers = catchAsync(
  async (request: Request, response: Response) => {
    const users = await usersLogic.getUsers();
    response.status(201).json({
      status: "success",
      data: {
        users,
      },
    });
  }
);
