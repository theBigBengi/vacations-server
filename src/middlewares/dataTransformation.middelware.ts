import { Request, Response, NextFunction } from "express";

import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

// Middleware to transform request data from camel case to snake case
export function camelToSnakeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body) {
    req.body = snakecaseKeys(req.body);
  }
  next();
}

// Middleware to transform response data from snake case to camel case
export function snakeToCamelMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json;
  res.json = function (body): Response {
    const camelCaseBody = camelcaseKeys(body, { deep: true });
    return originalJson.call(res, camelCaseBody);
  };
  next();
}
