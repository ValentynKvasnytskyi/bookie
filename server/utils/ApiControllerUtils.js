import { Types } from "mongoose";
/**
 * A utility class for common controller operations.
 */
export default class ApiControllerUtils {
    /**
     * Performs a paginated query on a Mongoose model.
     * @template T - The type of data in the model.
     * @param {Model<T>} model - The Mongoose model to query.
     * @param {Request} req - The Express request object.
     * @param {Promise<number>} totalCountQuery - The query to get the total count of items matching the query.
     * @param {Filter} [filter={}] - The filter to apply to the query.
     * @returns {Promise<PaginatedResult<T>>} The paginated result of the query.
     */
    static async getPaginatedResults(model, req, totalCountQuery, filter = {}) {
        const pagination = req.query.pagination !== "false";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        let query = model.find(filter);
        if (pagination) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const [data, totalCount] = await Promise.all([query, totalCountQuery]);
        return {
            data,
            totalCount,
        };
    }
    /**
     * Builds a filter object from the query parameters in the request.
     * @template T - The type of data in the model.
     * @param {Request} req - The Express request object.
     * @returns {Filter} The filter object built from the request parameters.
     */
    static buildFilter(req) {
        const filter = {};
        Object.keys(req.query).forEach((key) => {
            // need to search nullable values
            if (req.query[key] === "null") {
                filter[key] = null;
            }
            else if (key !== "page" && key !== "limit" && key !== "pagination") {
                filter[key] = req.query[key];
            }
        });
        return filter;
    }
    /**
     * Validates if the provided ID is valid.
     * @param {string} id - The ID to validate.
     * @param {Response} res - The Express response object.
     * @returns {boolean} - Indicates whether the ID is valid.
     */
    static isValidId(id, res) {
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: { message: "Invalid ID" } });
            return false;
        }
        return true;
    }
}
