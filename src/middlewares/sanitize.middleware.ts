import { Request, Response, NextFunction } from "express";
import stripTags from "striptags";

/**
 *   this middleware sanitizing inputs
 */

export default (req: Request, res: Response, next: NextFunction) => {
  for (const prop in req.body) {
    const property = req.body[prop];
    if (typeof property === "string") {
      req.body[prop] = stripTags(property);
    }
  }
  for (const prop in req.query) {
    const property = req.query[prop];
    if (typeof property === "string") {
      req.query[prop] = stripTags(property);
    }
  }

  next();
};
