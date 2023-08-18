import { IUser } from "../models/user.model";
import { IVacation } from "../models/vacation.model";

/**
 *
 */

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      vacation?: IVacation;
      query: {
        limit?: string;
        page?: string;
        orderBy?: string;
      };
    }
  }
}

/**
 *
 */

export interface QueryExecutionOptions {
  sort?: string;
  limit?: number;
  page?: number;
  fields?: string;
  [key: string]: any; // Allow for additional query parameters
}

/**
 *  logger log message
 */

export interface LogMessage {
  level: string;
  message: string;
  timestamp?: string;
}
