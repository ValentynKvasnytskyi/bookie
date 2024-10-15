import { Types, Model, Query, FilterQuery } from "mongoose";

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
}

export interface PaginationOptions {
  pagination: boolean;
  page: number;
  limit: number;
}

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}
export default class ApiControllerUtils {
  /**
   * Performs a paginated query on a Mongoose model.
   * @template T - The type of data in the model.
   * @param {Query<T[], T>} query - The Mongoose query.
   * @param {Promise<number>} totalCountQuery - The query to get the total count of items matching the query.
   * @param {PaginationOptions} paginationOptions - The options for pagination.
   * @returns {Promise<PaginatedResult<T>>} The paginated result of the query.
   */
  static async getPaginatedResults<T>(
    query: Query<T[], T>,
    totalCountQuery: Promise<number>,
    paginationOptions: PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const { pagination, page, limit } = paginationOptions;

    if (pagination) {
      const skip: number = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const [data, totalCount] = await Promise.all([query.exec(), totalCountQuery]);

    return {
      data,
      totalCount,
    };
  }

  /**
   * Builds a filter object from the query parameters.
   * @template T - The type of data in the model.
   * @param {Record<string, string | string[]>} queryParams - The query parameters.
   * @returns {FilterQuery<T>} The filter object built from the query parameters.
   */
  static buildFilter<T>(queryParams: QueryParams): FilterQuery<T> {
    const filter: FilterQuery<T> = {};

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value === "null") {
        (filter as any)[key] = null;
      } else if (key !== "page" && key !== "limit" && key !== "pagination" && value !== undefined) {
        (filter as any)[key] = value;
      }
    });

    return filter;
  }

  /**
   * Validates if the provided ID is a valid MongoDB ObjectId.
   * @param {string} id - The ID to validate.
   * @returns {boolean} - Indicates whether the ID is valid.
   */
  static isValidId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }
}
