import { VacationsQueries } from "../data/mysql/queries/vacations.queries";
import { IVacation, IVacationFollowersReport } from "../models/vacation.model";
import { enhanceQuery, execute } from "../data/mysql/db";
import { QueryExecutionOptions } from "../global/tyes";
import { ApiFeatures } from "../data/ApiFeatuers";

/**
 * gets vacations
 */
export const search = async (key: string) => {
  const vacations = await execute<IVacation[]>(
    `SELECT * FROM vacations WHERE destination LIKE '%${key}%'`
  );

  return { vacations };
};

/**
 * gets vacations
 */
export const find = async (
  executeOptions: QueryExecutionOptions,
  userId?: number
) => {
  // Create an instance of ApiFeatures with the desired table name, request query, and optional sub query
  const features = await new ApiFeatures(
    "vacations",
    executeOptions,
    VacationsQueries.getVacationsWithFollowers(userId) // Assuming VacationsQueries.getVacationsWithFollowers(userId) returns a sub query string
  )
    .select() // Apply the select method to choose specific columns
    .filter() // Apply the filter method to filter results based on query parameters
    .sort() // Apply the sort method to sort the results
    .paginate() // Apply the paginate method to paginate and limit the results
    .total();

  const vacations = await execute<IVacation[]>(features.query);

  return { vacations, total: features.totalResults };
};

/**
 * gets a vacation based on id provided
 *
 * @param id number
 * @returns vacation IVacation
 */
export const findById = async (id: IVacation["id"]): Promise<IVacation> => {
  const [vacation] = await execute<IVacation[]>(
    VacationsQueries.GetVacationsById,
    [id]
  );

  return vacation;
};

/**
 * adds a new vacation record
 *
 * @param vacation IVacation
 * @returns insertId Promise<number>
 */

export const insert = async (vacation: IVacation): Promise<number> => {
  const result = await execute<{ insertId: number }>(
    VacationsQueries.AddVacation,
    [
      vacation.destination,
      vacation.description,
      vacation.startingDate,
      vacation.endingDate,
      vacation.price,
      vacation.imgUrl,
    ]
  );

  return result.insertId;
};

/**
 *  updates team information based on the id provided
 *
 *  return boolean
 */

export const update = async (vacation: IVacation): Promise<boolean> => {
  const result = await execute<{ changedRows: number }>(
    VacationsQueries.UpdateVacationById,
    [
      vacation.destination,
      vacation.description,
      vacation.startingDate,
      vacation.endingDate,
      vacation.price,
      vacation.imgUrl,
      vacation.id,
    ]
  );

  return result.changedRows > 0;
};

/**
 *  updates team information based on the id provided
 *
 *  @param id number
 *  return boolean
 */
export const remove = async (id: IVacation["id"]): Promise<boolean> => {
  const result = await execute<{ affectedRows: number }>(
    VacationsQueries.DeleteVacationById,
    [id]
  );
  return result.affectedRows > 0;
};

/**
 *
 */
export const findReports = async (
  options: QueryExecutionOptions
): Promise<IVacationFollowersReport[]> => {
  // add pagination and order by
  const enhancedQuery = enhanceQuery(
    VacationsQueries.GetFollowersReports,
    options
  );

  return execute<IVacationFollowersReport[]>(enhancedQuery, []);
};
