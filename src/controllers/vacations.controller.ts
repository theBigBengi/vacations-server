import { Request, Response, RequestHandler } from "express";
import catchAsync from "../utils/catch";
import * as VacationLogic from "../logic/vacations.logic";
import * as FollowersLogic from "../logic/followers.logic";
import { IVacation } from "../models/vacation.model";
import { AppError } from "../errors/AppError";
import { IUser } from "../models/user.model";
import { json2csv } from "json-2-csv";
import { QueryExecutionOptions } from "../global/tyes";

/**
 * Adds a new vacation record.
 */

export const searchVacation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const vacations = await VacationLogic.search(req.query.key as string);

    res.status(200).json({
      status: "success",
      data: vacations,
    });
  }
);

/**
 * Adds a new vacation record.
 */

export const createVacation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const vacationId = await VacationLogic.insert(req.body);

    res.status(200).json({
      status: "success",
      data: { vacationId },
    });
  }
);

/**
 * Retrieves a list of vacations with pagination and sorting options.
 */

export const getVacations: RequestHandler = catchAsync(
  async (req: Request<QueryExecutionOptions>, res: Response) => {
    const withFollowing: boolean = req.query.following === "true";
    const userId: IUser["id"] | undefined = withFollowing
      ? req.user?.id
      : undefined;

    const { vacations, total } = await VacationLogic.find(req.query, userId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const hasNext = total !== null ? page * limit < total : false;

    res.status(200).json({
      status: "success",

      pagination: {
        page,
        hasNext,
        perPage: limit,
        total,
      },

      results: vacations.length,
      data: { vacations },
    });
  }
);

/**
 * Retrieves a vacation by its ID.
 */

export const getVacationById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      data: {
        vacation: req.vacation, // Assuming req.vacation is attached by some middleware
      },
    });
  }
);

/**
 * Updates existing vacation record based on the id provided
 */

export const updateVacationById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const updatedVacation: IVacation = Object.assign(
      { ...req.vacation },
      { ...req.body }
    );

    const result = await VacationLogic.update(updatedVacation);

    const message = result ? "updated" : "Nothing to update";

    res.status(200).json({
      status: "success",
      message,
    });
  }
);

/**
 * Deletes a vacation by its ID.
 */
export const deleteVacationById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    await VacationLogic.remove(req.vacation!.id); // Assuming req.vacation is attached by some middleware

    res.status(200).json({ status: "success", message: "deleted" });
  }
);

/**
 * Follow a vacation.
 */

export const followVacation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const vacationId = req.vacation!.id;
    const userId = (req.user as IUser).id;

    const [follower] = await FollowersLogic.findFollowerByUserVacation(
      vacationId,
      userId
    );

    if (follower) {
      throw new AppError(
        `user(${userId}) is already following this vacation(${vacationId})`,
        400
      );
    }

    const result = await FollowersLogic.insert({
      vacationId,
      userId,
    });

    res.status(200).json({ status: result ? "success" : "fail" });
  }
);

/**
 * Unfollow a vacation.
 */

export const unfollowVacation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const vacationId = req.vacation?.id as IVacation["id"];
    const userId = req.user?.id as IUser["id"];

    const [follower] = await FollowersLogic.findFollowerByUserVacation(
      vacationId,
      userId
    );

    if (!follower) {
      throw new AppError(
        `user(${userId}) is NOT following this vacation(${vacationId})`,
        400
      );
    }

    const result = await FollowersLogic.remove(follower.id);

    res.status(200).json({ status: "success" });
  }
);

/**
 * Get vacations reports.
 */

export const getReports: RequestHandler = catchAsync(
  async (
    req: Request<
      { type: string },
      {},
      {},
      { format: string; orderBy: string; page: string; limit: string }
    >,
    res: Response
  ) => {
    const reportSupportedTypes = ["followers"];
    const { type } = req.params;
    const { format, orderBy, limit, page } = req.query;

    const options = {
      ...(format !== "csv" && {
        limit: Math.abs(Number(limit)) || 10,
        page: Math.abs(Number(page)) || 1,
      }),
      orderBy,
    };

    if (!reportSupportedTypes.includes(type)) {
      throw new AppError(`Format "${type}" not supported`, 400);
    }

    const reports = await VacationLogic.findReports(options);

    if (format === "csv") {
      res.header("Content-Type", "text/csv");
      res.attachment("vacations-followers-report.csv");

      const csv = await json2csv(reports);
      return res.send(csv);
    }

    // Add other format implementations here...

    res.json({
      status: "success",
      data: {
        reports,
      },
    });
  }
);
