import express from "express";
import { ProvidersController } from "./providers.controller.ts";

const router = express.Router();
const providersController = new ProvidersController();

router.get("/providers", providersController.getAll);
router.get("/providers/:id", providersController.getItemById);
router.post("/providers/create", providersController.createItem);
router.patch("/providers/:id/update", providersController.updateItem);
router.delete("/providers/:id/delete", providersController.deleteItem);

export default router;
