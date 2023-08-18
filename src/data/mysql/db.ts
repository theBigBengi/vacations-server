import { createPool, Pool } from "mysql";
import { AppError } from "../../errors/AppError";
import { QueryExecutionOptions } from "../../global/tyes";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

export let pool: Pool;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
  try {
    pool = createPool({
      connectionLimit: Number(CONFIG.DB_CONNECTION_LIMIT) || 10,
      host: CONFIG.DB_HOST,
      user: CONFIG.DB_USER,
      password: CONFIG.DB_PASSWORD,
      database: CONFIG.DB_DATABASE,
    });
    logger.info(`MySql adapter pool generated successfully`);
  } catch (error: any) {
    logger.error(`MySql connector init Error: ${error?.message}`);
    throw new AppError("Failed to initialized pool", 500);
  }
};

/**
 * Executes SQL queries in MySQL database.
 *
 * @param {string} query - The SQL query to execute.
 * @param {Array<any> | Record<string, any>} params - The parameterized values used in the query.
 * @returns {Promise<T>} - The promise that resolves with the query results.
 */
export const execute = <T>(
  query: string,
  params: string[] | Object = []
): Promise<T> => {
  if (!pool) throw new Error("Pool was not created. ");

  // promisify query executaion
  return new Promise<T>((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      logger.info(query);
      if (error) {
        reject(error);
      } else {
        // transform from snake case to camel case letters
        const transformedResults = camelcaseKeys(results);
        resolve(transformedResults);
      }
    });
  });
};

/**
 * Enhances the SQL query based on the provided options.
 *
 * @param {string} query - The SQL query to enhance.
 * @param {QueryExecutionOptions} options - The options for enhancing the query.
 * @returns {string} - The enhanced SQL query.
 */
export function enhanceQuery(
  query: string,
  options?: QueryExecutionOptions
): string {
  if (options?.orderBy) {
    //  order by
    const order = options.orderBy.startsWith("-") ? "DESC" : "ASC";
    const orderBy = options.orderBy.replace(/^-/, "");

    const allowedFields = ["startingDate", "price", "endingDate", "count"];
    if (!allowedFields.includes(orderBy)) {
      throw new AppError(
        `${orderBy} is not allowed value. You can order by price/startingDate/endingDate/count`,
        401
      );
    }

    const fieldMappings: Record<string, string> = {
      startingDate: "starting_date",
      endingDate: "ending_date",
    };

    const mappedOrderBy = fieldMappings[orderBy] || orderBy;

    query += ` ORDER BY ${mappedOrderBy} ${order}`;
  }

  //  pagination
  if (options?.page || options?.limit) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    query += ` LIMIT ${offset}, ${limit}`;
  }

  return query;
}
