import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catch";
import { transformVacation } from "../utils/transform";
import { IVacation } from "../models/vacation.model";

/**
 * This middleware is adding a patch to the response.json() method
 * every route that will be use this middleware will be effected
 *  the main goal is to format the vacations returned object/array
 * on the database wee are using different names from the api
 * so we want to transform it to the wanted format
 *
 */

const transformVaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // storing the original response.json method (we will need it later)
    const originalJson: (body?: any) => Response = res.json;

    // adding extra functionality to the json method
    res.json = function (body?: any): Response {
      // Skip on error
      if (body && body.err) {
        next();
      }
      // Arguments that passed to the original response.json() method
      // we are returning the vacations as field inside the data
      let { data } = body || {};

      // if we retuning vacations
      if (data && data.vacations) {
        data.vacations = data.vacations.map((vacation: IVacation) => {
          return transformVacation(vacation);
        });
      }

      // if we retuning single vacation
      if (data && data.vacation) {
        data.vacation = transformVacation(data.vacation);
      }

      // override with the new formatted vacations
      body = {
        ...body,
        data,
      };

      // finally, call the method with the new arguments
      return originalJson.call(res, body);
    };

    next();
  }
);

export default transformVaction;
