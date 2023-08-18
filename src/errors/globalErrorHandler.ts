import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
import logger from "../utils/logger";

const handleSqlQueryError = (): AppError =>
  new AppError("query input error", 401);

const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired. Please log in.", 401);

/**
 *  Handling development errors
 */

const sendErrorDev = (err: any, req: Request, res: Response): void => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

/**
 *  Handling production errors
 */

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // API ERRORS
  if (req.originalUrl.startsWith("/api")) {
    console.error(logger.error("ERROR 💥"), err);
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error(logger.error("ERROR 💥"), err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log(err);
    let error = { ...err };
    error.message = err.message;

    if (error.sqlMessage) {
      // Add specific error handling for ValidationError if needed
      error = handleSqlQueryError();
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, req, res);
  }
}

export default globalErrorHandler;
