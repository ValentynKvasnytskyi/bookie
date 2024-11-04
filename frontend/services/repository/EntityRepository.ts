import mongoose, { Model, Document } from "mongoose";
import { QueryParams } from "../../../server/utils/ApiControllerUtils.ts";
import ApiControllerUtils, { PaginatedResult, PaginationOptions } from "../../../server/utils/ApiControllerUtils.ts";
export interface ControllerOptions {
  dateFields?: string[];
}

export default class EntityRepository<T extends Document> {
  private readonly model: Model<T>;
  private readonly populateFields: string[];
  private readonly dateFields: string[];
  private readonly GET_ITEMS_LIMIT = 10;

  constructor(entityModelName: string, populateFields: string[] = [], options: ControllerOptions = {}) {
    this.model = mongoose.models[entityModelName];
    this.populateFields = populateFields;
    this.dateFields = options.dateFields || [];
  }

  async getAll(query: QueryParams = {}): Promise<PaginatedResult<T>> {
    try {
      const baseFilter = ApiControllerUtils.buildFilter<T>(query);
      const dateFilters = this.buildDateFilters(query);
      const filter = { ...baseFilter, ...dateFilters };

      this.dateFields.forEach((field) => {
        delete (filter as any)[`${field}[after]`];
        delete (filter as any)[`${field}[before]`];
      });

      const paginationOptions = this.getPaginationOptions(query);
      let queryObj = this.model.find(filter);

      this.populateFields.forEach((field: string) => {
        queryObj = queryObj.populate(field);
      });

      const totalCountQuery = this.model.countDocuments(filter);

      const { data, totalCount } = await ApiControllerUtils.getPaginatedResults<T>(
        queryObj,
        totalCountQuery,
        paginationOptions,
      );

      return { data, totalCount };
    } catch (error) {
      throw new Error(`Error retrieving entities: ${(error as Error).message}`);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      if (!ApiControllerUtils.isValidId(id)) {
        throw new Error("Invalid ID");
      }

      let queryObj = this.model.findById(id);

      this.populateFields.forEach((field: string) => {
        queryObj = queryObj.populate(field);
      });

      const item = await queryObj.exec();

      if (!item) {
        throw new Error("Entity not found");
      }

      return item;
    } catch (error) {
      throw new Error(`Error retrieving entity by ID: ${(error as Error).message}`);
    }
  }

  private getPaginationOptions(query: QueryParams): PaginationOptions {
    const paginationParamExists = query.pagination !== undefined;
    return {
      pagination: paginationParamExists ? (query.pagination as boolean) : true,
      page: parseInt(query.page as string) || 1,
      limit: parseInt(query.limit as string) || this.GET_ITEMS_LIMIT,
    };
  }

  private buildDateFilters(query: QueryParams): Record<string, any> {
    const dateFilters: Record<string, any> = {};

    this.dateFields.forEach((field) => {
      const beforeKey = `${field}[before]`;
      const afterKey = `${field}[after]`;

      if (query[beforeKey] || query[afterKey]) {
        dateFilters[field] = {};

        if (query[beforeKey]) {
          const date = new Date(query[beforeKey] as string);
          date.setHours(23, 59, 59, 999);
          dateFilters[field]["$lte"] = date.toISOString();
          delete query[beforeKey];
        }

        if (query[afterKey]) {
          const date = new Date(query[afterKey] as string);
          date.setHours(0, 0, 0, 0);
          dateFilters[field]["$gte"] = date.toISOString();
          delete query[afterKey];
        }
      }
    });

    return dateFilters;
  }
}
