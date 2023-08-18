import { NextFunction, Request, RequestHandler, Response } from "express";
import schemas from "../utils/schemas";
import { AppError } from "../errors/AppError";
import catchAsync from "../utils/catch";
import { ValidationResult } from "joi";

const generateErrorMessage = (errorDetails: ValidationError[]) =>
  errorDetails.map(({ message }) => message.replace(/['"]/g, "")).join(", ");

interface ValidationError {
  message: string;
  type: string;
}

const supportedMethods: string[] = ["post", "put", "patch", "delete"];

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

// REFERENCE: https://dev.to/jeffsalive/the-right-way-to-use-joi-validator-in-your-nodejs-express-application-147g
const bodyValidator = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract the route handle path
    const path = req.originalUrl.split("v1")[1];
    // Get validation schema by the route's path
    const schemaKey = `[${req.method}][${
      Object.keys(req.params).length ? req.baseUrl : req.originalUrl
    }]`
      .replace(/\//g, ".")
      .toLowerCase();

    const schema = schemas[schemaKey];

    if (!schema) {
      throw new Error(`Schema not found for path: ${path}`);
    }

    const method: string = req.method.toLowerCase();
    if (!supportedMethods.includes(method)) {
      return next();
    }

    const { error, value }: ValidationResult<any> = schema.validate(
      req.body,
      validationOptions
    );

    if (error) {
      const errorMessage: string = generateErrorMessage(error.details);
      return next(new AppError(errorMessage, 400));
    }

    // validation successful
    next();
  }
);

export default bodyValidator;
