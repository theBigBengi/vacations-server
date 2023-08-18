import express from "express";
import { signin, signup, signout } from "../controllers/auth.controller";
import schemaValidator from "../middlewares/validator.middleware";

const authRouter = express.Router();

// Create a new Tutorial
authRouter.route("/signup").post(schemaValidator, signup);
authRouter.route("/signin").post(schemaValidator, signin);
authRouter.route("/signout").get(signout);

export default authRouter;
