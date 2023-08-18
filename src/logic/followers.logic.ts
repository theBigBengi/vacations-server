import { enhanceQuery, execute } from "../data/mysql/db";
import { IFollower } from "../models/follower.model";
import { FollowersQueries } from "../data/mysql/queries/followers.queris";
import { QueryExecutionOptions } from "../global/tyes";

/**
 * gets vacations
 */
export const findFollowers = async (options: QueryExecutionOptions) => {
  const enhancedQuery = enhanceQuery(FollowersQueries.GetFollowers, options);
  return execute<IFollower[]>(enhancedQuery, []);
};

/**
 * gets vacations
 */
export const findFollowerByUserVacation = async (
  vacationId: number,
  userId: number
) => {
  return execute<IFollower[]>(FollowersQueries.getFollowerByUserVacation, [
    vacationId,
    userId,
  ]);
};

/**
 * gets a vacation based on id provided
 *
 * @param id number
 * @returns vacation IVacation
 */
export const getFollowerById = async (id: IFollower["id"]) => {
  const result = await execute<IFollower[]>(FollowersQueries.GetFollowerById, [
    id,
  ]);

  return result[0];
};

/**
 * adds a new vacation record
 *
 * @param vacation IVacation
 * @returns insertId Promise<number>
 */
export const insert = async (follower: IFollower) => {
  const result = await execute<{ affectedRows: number }>(
    FollowersQueries.AddFollower,
    [follower.vacationId, follower.userId]
  );

  return result.affectedRows > 0;
};

/**
 * updates team information based on the id provided
 */
export const remove = async (id: IFollower["id"]): Promise<boolean> => {
  const result = await execute<{ affectedRows: number }>(
    FollowersQueries.DeleteFollowerById,
    [id]
  );
  return result.affectedRows > 0;
};
