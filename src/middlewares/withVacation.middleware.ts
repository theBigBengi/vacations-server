import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catch";
import { AppError } from "../errors/AppError";
import { findById } from "../logic/vacations.logic";
import { IVacation } from "../models/vacation.model";

/**
 *  This middleware is adding vacation:IVacation to the request
 */

const withVacation = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get vacation's id from the request's params
    const id = req.params.id;

    // Check if id is valid id (number)
    if (!/^\d+$/.test(id)) {
      return next(new AppError("Invalid id", 400));
    }

    // Check if vacation is exists
    const vacationId: number = Math.abs(Number(id));
    let vacation: IVacation = await findById(vacationId);
    if (!vacation) {
      throw new AppError("Invalid id", 400);
    }

    // Attach vacation to the request
    req.vacation = vacation;

    next();
  }
);

export default withVacation;
