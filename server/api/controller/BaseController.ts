import { Request, Response } from "express";
import mongoose, { Model, Document } from "mongoose";
import { logger } from "../../utils/logger.ts";
import ApiControllerUtils, { QueryParams, PaginationOptions } from "../../utils/ApiControllerUtils.ts";

export interface ControllerOptions {
  dateFields?: string[];
}

/**
 * Controller class for handling CRUD operations.
 */
export default abstract class BaseController<T extends Document> {
  private readonly model: Model<T>;
  private readonly populateFields: string[];
  private readonly dateFields: string[];
  private readonly GET_ITEMS_LIMIT = 10;

  protected constructor(model: Model<T>, populateFields: string[] = [], options: ControllerOptions = {}) {
    this.model = mongoose.models[model.modelName] || model;
    this.populateFields = populateFields;
    this.dateFields = options.dateFields || [];
  }

  private getPaginationOptions(query: QueryParams): PaginationOptions {
    const paginationParamExists = query.pagination !== undefined;
    return {
      pagination: paginationParamExists ? (query.pagination as boolean) : true,
      page: parseInt(query.page as string) || 1,
      limit: parseInt(query.limit as string) || this.GET_ITEMS_LIMIT,
    };
  }

  /**
   * Get all
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const baseFilter = ApiControllerUtils.buildFilter<T>(req.query as QueryParams);
      const dateFilters = this.buildDateFilters(req.query as QueryParams);
      const filter = { ...baseFilter, ...dateFilters };

      const paginationOptions = this.getPaginationOptions(req.query as QueryParams);
      let query = this.model.find(filter);

      this.populateFields.forEach((field: string) => {
        query = query.populate(field);
      });

      const totalCountQuery = this.model.countDocuments(filter);

      const { data, totalCount } = await ApiControllerUtils.getPaginatedResults<T>(
        query,
        totalCountQuery,
        paginationOptions,
      );

      res.status(200).json({ data, totalCount });
    } catch (error) {
      logger.error(`Error retrieving ${this.model.modelName}`);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  /**
   * Get an item by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      if (!ApiControllerUtils.isValidId(id)) {
        res.status(400).json({ error: { message: "Invalid ID" } });
        return;
      }

      let query = this.model.findById(id);

      this.populateFields.forEach((field: string) => {
        query = query.populate(field);
      });

      const item: T | null = await query.exec();

      if (!item) {
        res.status(404).json({
          id: id,
          service: this.model.modelName,
          message: "Not found",
        });
        return;
      }

      res.status(200).json(item);
    } catch (error) {
      logger.error("Error retrieving item by ID");
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  /**
   * Create a new item.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const newItem: T = new this.model(req.body);
      await newItem.save();

      let query = this.model.findById(newItem._id);

      this.populateFields.forEach((field: string) => {
        query = query.populate(field);
      });

      const item: T | null = await query.exec();

      if (!item) {
        res.status(404).json({
          id: newItem._id,
          service: this.model.modelName,
          message: "Not found",
        });
        return;
      }

      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  /**
   * Update an item by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      if (!ApiControllerUtils.isValidId(id)) {
        res.status(400).json({ error: { message: "Invalid ID" } });
      }

      const updatedItem: T | null = await this.model.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedItem) {
        res.status(404).json({
          id: id,
          service: this.model.modelName,
          message: "Not found",
        });
        return;
      }

      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  /**
   * Delete an item by ID.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;
      if (!ApiControllerUtils.isValidId(id)) {
        res.status(400).json({ error: { message: "Invalid ID" } });
        return;
      }

      const deletedItem: T | null = await this.model.findByIdAndDelete(id);
      if (!deletedItem) {
        res.status(404).json({
          id: id,
          service: this.model.modelName,
          message: "Not found",
        });
        return;
      }

      res.status(200).json({ status: "OK" });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  /**
   * Check if entities exist by filter
   * @returns {Promise<boolean>} - Returns true if entities exist, false otherwise
   * @param req
   * @param res
   */
  checkExistence = async (req: Request, res: Response): Promise<void> => {
    try {
      const baseFilter = ApiControllerUtils.buildFilter<T>(req.query as QueryParams);
      const dateFilters = this.buildDateFilters(req.query as QueryParams);
      const filter = { ...baseFilter, ...dateFilters };

      const paginationOptions = this.getPaginationOptions(req.query as QueryParams);
      const query = this.model.find(filter);
      const totalCountQuery = this.model.countDocuments(filter);

      const { totalCount } = await ApiControllerUtils.getPaginatedResults<T>(query, totalCountQuery, paginationOptions);

      res.status(200).json({ exists: totalCount > 0 });
    } catch (error) {
      logger.error(`Error checking existence in ${this.model.modelName}`);
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  protected buildDateFilters(query: QueryParams): Record<string, any> {
    const dateFilters: Record<string, any> = {};

    this.dateFields.forEach((field) => {
      const dateFilter = query[field] as any;

      if (dateFilter?.before || dateFilter?.after) {
        dateFilters[field] = {};

        if (dateFilter.before) {
          const date = new Date(dateFilter.before);
          date.setHours(23, 59, 59, 999);
          dateFilters[field]["$lte"] = date.toISOString();
        }

        if (dateFilter.after) {
          const date = new Date(dateFilter.after);
          date.setHours(0, 0, 0, 0);
          dateFilters[field]["$gte"] = date.toISOString();
        }
      }
    });

    return dateFilters;
  }
}
