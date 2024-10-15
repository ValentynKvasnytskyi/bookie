import express from "express";
import CategoriesController from "./categories.controller.ts";

const router = express.Router();
const categoriesController = new CategoriesController();

router.get("/categories", categoriesController.getAll);
router.get("/categories/:id", categoriesController.getItemById);
router.post("/categories/create", categoriesController.createItem);
router.patch("/categories/:id/update", categoriesController.updateItem);
router.delete("/categories/:id/delete", categoriesController.deleteItem);

export default router;
