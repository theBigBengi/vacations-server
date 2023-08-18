import express, { Request, Response } from "express";
import { insertUser, getUsers } from "../controllers/users.controller";
import { execute } from "../data/mysql/db";
import { ApiFeatures } from "../data/ApiFeatuers";
import _catch from "../utils/catch";

const usersRouter = express.Router();

// usersRouter.route("/").get(getUsers);
usersRouter.route("/").get(
  _catch(async (req: Request, res: Response) => {
    const features = new ApiFeatures("users", req.query)
      .select()
      .filter()
      .sort()
      .paginate();

    // features.select().filter().sort().paginate();

    const users = await execute(features.query);

    res.status(200).json({
      status: "success",
      data: { users },
    });
  })
);

// usersRouter
//   .route("/:id")
//   .get(getVacationById)
//   .patch(reqBodyValidation(schemas.users), updateVacationById)
//   .delete(deleteVactionById);

export { usersRouter };
