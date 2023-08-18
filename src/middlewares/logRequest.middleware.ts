import chalk from "chalk";
import logger from "../utils/logger";

import { Request, Response, NextFunction } from "express";

const logRequests = (req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `${chalk.bold.gray(req.method)} ${chalk.bold.gray(req.originalUrl)}`
  );

  // transfer flow to next middleware or to the controller
  next();
};

export default logRequests;
