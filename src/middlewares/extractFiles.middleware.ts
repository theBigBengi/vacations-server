import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catch";
import schemas from "../utils/schemas";
import { extractFilesFromReq } from "../utils/files";

/**
 *  this middleware extracting uploaded files from the request's files property
 *  and then adding them to the request's body and pass it to the bodyValidator middleware
 *
 */

const parseFiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const val = `[${req.method}][${
      Object.keys(req.params).length ? req.baseUrl : req.originalUrl
    }]`
      .replace(/\//g, ".")
      .toLowerCase();

    const schema = schemas[val];
    let uploadedFileFields = await extractFilesFromReq(
      { ...req.files },
      schema
    );

    req.body = {
      ...req.body,
      ...uploadedFileFields,
    };

    next();
  }
);

export default parseFiles;
