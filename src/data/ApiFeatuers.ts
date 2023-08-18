import { snakeCase } from "change-case";
import { execute } from "./mysql/db";
import { QueryExecutionOptions } from "../global/tyes";
import logger from "../utils/logger";
import { isDateField, isValidDate } from "../utils/dates";
import { isNumber } from "../utils/numbers";

// Define the interface for the columns of each table
interface Columns {
  [tableName: string]: string[];
}

// Define the columns for each table
const columns: Columns = {
  vacations: [
    "id",
    "startingDate",
    "endingDate",
    "price",
    "destination",
    "description",
    "imgUrl",
    "followers",
  ],
  users: ["id", "firstName", "lastName", "email", "password", "role"],
};

// Define the ApiFeatures class
export class ApiFeatures {
  public query = ``;
  public totalResults: number | null = null; // Initialize totalResults as null

  constructor(
    // SQL table name
    public tableName: string,
    /**
     * Enrich query with options
     *
     *  {
     *    sort:columnName,
     *    limit:x,
     *    page:y,
     *    fields:columnName1,columnName2....,
     *    columnName1:value1,
     *    columnName2:value2,
     *    ...
     *  }
     */
    public queryOptions: QueryExecutionOptions,
    // Sub SQL query
    public subQuery?: string
  ) {
    // Adding sub query or table
    this.query += subQuery
      ? `SELECT * FROM (${subQuery}) AS ${tableName}`
      : `SELECT * FROM ${tableName}`;
  }

  /**
   * Select which fields to include
   *
   * ...baseUrl/api/v1/someRoute?fields=columnName1,columnName2
   *
   * @returns {this} The current ApiFeatures instance with selected fields applied.
   */
  select(): this {
    if (this.queryOptions.fields) {
      const requestedFields = this.queryOptions.fields.split(",");

      // Filter requested fields to only include valid ones
      const validFields = requestedFields.filter((field: string) =>
        columns[this.tableName].includes(field)
      );

      // Check if any fields were explicitly excluded with a "-" prefix
      const excludedFields = requestedFields
        .filter((field: string) => field.startsWith("-"))
        .map((field: string) => field.substring(1));

      // Add default fields if no valid fields are provided
      const finalFields =
        validFields.length > 0 ? validFields : columns[this.tableName];

      // Exclude explicitly excluded fields
      const filteredFields = finalFields.filter(
        (field: string) => !excludedFields.includes(field)
      );

      // Transform fields from camelCase to snakeCase for database compatibility
      const snakeCaseFields = filteredFields.map((field: string) =>
        snakeCase(field)
      );

      // Join the fields into a comma-separated string
      const selectedFields = snakeCaseFields.join(", ");

      // Replace the "*" in the query with the selected fields
      this.query = this.query.replace("*", selectedFields);
    }

    return this;
  }

  /**
   * Filter results by conditions
   *
   * ...baseUrl/api/v1/someRoute?columnName1=value1,columnName2=value2...
   *
   * if you want to use greater than (>) or less than (<) just add "gt" or "lt" before your value
   * default operator is for equality "="
   *  - startingDate=gt2023-07-22 ---> starting_date > 2023-07-22
   *  - startingDate=lt2023-07-22 ---> starting_date < 2023-07-22
   *  - startingDate=2023-07-22 ---> starting_date = 2023-07-22
   *
   * @returns {this} The current ApiFeatures instance with filters applied.
   */
  filter(): this {
    // Destructure the query string and exclude certain fields (page, sort, limit, fields) from queryObj
    const { page, sort, limit, fields, ...queryObj } = this.queryOptions;
    // Get the valid fields for the current table
    const validFields = columns[this.tableName];

    // Create an array of filters based on the valid fields and their corresponding values
    const filters: string[] = Object.entries(queryObj)
      .filter(([key]) => validFields.includes(key)) // Filter only the valid fields from queryObj
      .filter(([key, value]) => {
        if (validFields.includes(key)) {
          // If the field is a date field, perform date validation
          if (isDateField(key) && !isValidDate(value)) {
            return false; // Skip invalid date values
          }
          return true; // Include valid fields (including those that are not date fields)
        }
        return false; // Skip invalid fields
      })
      .map(([key, value]) => {
        // Determine the operator based on the value (default: "=")
        const operator: string = (value as string).startsWith("gt")
          ? ">"
          : (value as string).startsWith("lt")
          ? "<"
          : "=";
        // Remove "gt" or "lt" prefix from the value
        value = (value as string).replace(/^(gt|lt)/, "");

        // Construct the filter string for the SQL query
        return `${snakeCase(key)} ${operator} "${value}"`;
      });

    // If there are filters, add them to the query with the "WHERE" keyword
    if (filters.length > 0) {
      this.query += ` WHERE ${filters.join(" AND ")}`;
    }

    return this;
  }

  /**
   * Sort results by column
   *
   * ...baseUrl/api/v1/someRoute?sort=columnName
   *
   * @returns {this} The current ApiFeatures instance with sorting applied.
   */
  sort(): this {
    if (this.queryOptions.sort) {
      const sortField = columns[this.tableName].includes(this.queryOptions.sort)
        ? this.queryOptions.sort
        : "id";
      const order = sortField.startsWith("-") ? "DESC" : "ASC";
      const orderBy = sortField.replace(/^-/, "");
      this.query += ` ORDER BY ${snakeCase(orderBy)} ${order}`;
    }

    return this;
  }

  /**
   * Apply pagination to the query.
   *
   * @returns {this} The current ApiFeatures instance with pagination applied.
   */
  paginate(): this {
    // Parse query string parameters for page and limit, with default values 1 and 10, respectively
    const page: number = isNumber(Number(this.queryOptions.page))
      ? Number(this.queryOptions.page)
      : 1;
    const limit: number = isNumber(Number(this.queryOptions.limit))
      ? Number(this.queryOptions.limit)
      : 10;

    // Calculate the offset based on the page and limit
    const offset: number = (page - 1) * limit;

    // Add LIMIT and OFFSET clauses to the query
    this.query += ` LIMIT ${offset}, ${limit}`;

    // Return the current instance to allow method chaining
    return this;
  }

  /**
   * get total results.
   *
   * @returns {this} The current ApiFeatures instance with pagination applied.
   */
  async total(): Promise<this> {
    try {
      const [results] = await execute<{ totalResults: number }[]>(
        `SELECT COUNT(*) AS totalResults FROM (${
          this.query.split("LIMIT")[0]
        }) as ${this.tableName} ;`
      );

      this.totalResults = results.totalResults;
    } catch (err: any) {
      logger.error(err.message);
    }
    return this;
  }
}
