import express from "express";
import CompaniesController from "./companies.controller.ts";

const POPULATE_FIELDS = ["schedule"];

const router = express.Router();
const companiesController = new CompaniesController(POPULATE_FIELDS);

router.get("/companies", companiesController.getAll);
router.get("/companies/:id", companiesController.getItemById);
router.post("/companies/create", companiesController.createItem);
router.patch("/companies/:id/update", companiesController.updateItem);
router.delete("/companies/:id/delete", companiesController.deleteItem);

export default router;
