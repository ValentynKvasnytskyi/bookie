import express from "express";
import ServicesController from "./services.controller.ts";

const router = express.Router();
const servicesController = new ServicesController();

router.get("/services", servicesController.getAll);
router.get("/services/:id", servicesController.getItemById);
router.post("/services/create", servicesController.createItem);
router.patch("/services/:id/update", servicesController.updateItem);
router.delete("/services/:id/delete", servicesController.deleteItem);

export default router;
