import { Request, Response } from "express";
import mongoose, { Model, Document, Query } from "mongoose";
import { logger } from "../../utils/logger.ts";
import ApiControllerUtils, { QueryParams, PaginationOptions, PaginatedResult } from "../../utils/ApiControllerUtils.ts";

/**
 * Controller class for handling CRUD operations.
 */
export default abstract class BaseController<T extends Document> {
  private readonly model: Model<T>;
  private readonly populateFields: string[];
  private readonly GET_ITEMS_LIMIT = 10;

  protected constructor(model: Model<T>, populateFields: string[] = []) {
    this.model = mongoose.models[model.modelName] || model;
    this.populateFields = populateFields;
  }

  private getPaginationOptions(query: QueryParams): PaginationOptions {
    return {
      pagination: query.pagination !== "false",
      page: parseInt(query.page as string) || 1,
      limit: parseInt(query.limit as string) || this.GET_ITEMS_LIMIT,
    };
  }

  /**
   * Get all items for SSR
   * @param {QueryParams} query - The query parameters
   * @param {string[]} populate - The list of fields to be populated
   * @returns {Promise<PaginatedResult<T>>}
   */
  async getAllItemsSSR(query: QueryParams, populate: string[] = []): Promise<PaginatedResult<T>> {
    const paginationOptions = this.getPaginationOptions(query);

    const filter = ApiControllerUtils.buildFilter<T>(query);

    let dbQuery = this.model.find(filter).lean();

    [...this.populateFields, ...populate].forEach((field: string) => {
      dbQuery = dbQuery.populate(field);
    });

    const totalCountQuery = this.model.countDocuments(filter);

    const typedDbQuery = dbQuery as unknown as Query<T[], T, NonNullable<unknown>, unknown, "find">;

    const { data, totalCount } = await ApiControllerUtils.getPaginatedResults<T>(
      typedDbQuery,
      totalCountQuery,
      paginationOptions,
    );

    return { data, totalCount };
  }

  /**
   * Get an item by ID for SSR
   * @param {string} id - The item ID
   * @param {string[]} populate - The list of fields to be populated
   * @returns {Promise<T | null>}
   */
  async getItemByIdSSR(id: string, populate: string[] = []): Promise<T | null> {
    if (!ApiControllerUtils.isValidId(id)) {
      throw new Error("Invalid ID");
    }

    let query = this.model.findById(id).lean();

    [...this.populateFields, ...populate].forEach((field: string) => {
      query = query.populate(field);
    });

    const result = await query.exec();

    return result as T | null;
  }

  /**
   * Get all
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>}
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = ApiControllerUtils.buildFilter<T>(req.query as QueryParams);

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
}

// import { Request, Response } from "express";
// import { Model, Document } from "mongoose";
// import { logger } from "../../utils/logger.ts";
// import ApiControllerUtils from "../../utils/ApiControllerUtils.ts";
// /**
//  * Controller class for handling CRUD operations.
//  */
// export default abstract class BaseController<T extends Document> {
//   private readonly model: Model<T>;
//   private readonly populateFields: string[];
//
//   protected constructor(model: Model<T>, populateFields: string[] = []) {
//     this.model = model;
//     this.populateFields = populateFields;
//   }
//
//   /**
//    * Get all
//    * @param {Request} req - The request object.
//    * @param {Response} res - The response object.
//    * @returns {Promise<void>}
//    */
//   getAll = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const filter = ApiControllerUtils.buildFilter(req);
//
//       let query = this.model.find(filter);
//
//       this.populateFields.forEach((field: string) => {
//         query = query.populate(field);
//       });
//
//       const totalCountQuery = this.model.countDocuments(filter);
//
//       const { data, totalCount } = await ApiControllerUtils.getPaginatedResults<T>(query, req, totalCountQuery);
//
//       res.status(200).json({ data, totalCount });
//     } catch (error) {
//       logger.error(`Error retrieving ${this.model.modelName}`);
//       res.status(500).json({ error });
//     }
//   };
//
//   /**
//    * Get an item by ID.
//    * @param {Request} req - The request object.
//    * @param {Response} res - The response object.
//    * @returns {Promise<void>}
//    */
//   getItemById = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const id: string = req.params.id;
//       if (!ApiControllerUtils.isValidId(id, res)) {
//         return;
//       }
//
//       let query = this.model.findById(req.params.id);
//
//       this.populateFields.forEach((field: string) => {
//         query = query.populate(field);
//       });
//
//       const item: T | null = await query.exec();
//
//       if (!item) {
//         res.status(404).json({
//           id: req.params.id,
//           service: this.model.modelName,
//           message: "Not found",
//         });
//         return;
//       }
//
//       // Возвращаем полный объект сущности
//       res.status(200).json(item);
//     } catch (error) {
//       logger.error("Error retrieving item by ID");
//       res.status(500).json({ error: { message: error.message } });
//     }
//   };
//
//   /**
//    * Create a new item.
//    * @param {Request} req - The request object.
//    * @param {Response} res - The response object.
//    * @returns {Promise<void>}
//    */
//   createItem = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const newItem: T = new this.model(req.body);
//       await newItem.save();
//
//       // Выполняем запрос с populate fields, чтобы получить полный объект
//       let query = this.model.findById(newItem._id);
//
//       this.populateFields.forEach((field: string) => {
//         query = query.populate(field);
//       });
//
//       const item: T | null = await query.exec();
//
//       if (!item) {
//         res.status(404).json({
//           id: newItem._id,
//           service: this.model.modelName,
//           message: "Not found",
//         });
//         return;
//       }
//
//       res.status(201).json(item);
//     } catch (error) {
//       res.status(400).json({ error: { message: error.message } });
//     }
//   };
//
//   /**
//    * Update an item by ID.
//    * @param {Request} req - The request object.
//    * @param {Response} res - The response object.
//    * @returns {Promise<void>}
//    */
//   updateItem = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const id: string = req.params.id;
//       if (!ApiControllerUtils.isValidId(id, res)) {
//         return;
//       }
//
//       const updatedItem: T | null = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!updatedItem) {
//         res.status(404).json({
//           id: req.params.id,
//           service: this.model.modelName,
//           message: "Not found",
//         });
//         return;
//       }
//
//       res.status(200).json(updatedItem);
//     } catch (error) {
//       res.status(500).json({ error: { message: error.message } });
//     }
//   };
//
//   /**
//    * Delete an item by ID.
//    * @param {Request} req - The request object.
//    * @param {Response} res - The response object.
//    * @returns {Promise<void>}
//    */
//   deleteItem = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const id: string = req.params.id;
//       if (!ApiControllerUtils.isValidId(id, res)) {
//         return;
//       }
//
//       const deletedItem: T | null = await this.model.findByIdAndDelete(req.params.id);
//       if (!deletedItem) {
//         res.status(404).json({
//           id: req.params.id,
//           service: this.model.modelName,
//           message: "Not found",
//         });
//         return;
//       }
//
//       res.status(200).json({ status: "OK" });
//     } catch (error) {
//       res.status(500).json({ error: { message: error.message } });
//     }
//   };
// }
