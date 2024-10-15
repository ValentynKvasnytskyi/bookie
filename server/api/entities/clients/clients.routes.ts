import express from "express";
import ClientsController from "./clients.controller.ts";

const router = express.Router();
const clientsController = new ClientsController();

router.get("/clients", clientsController.getAll);
router.get("/clients/:id", clientsController.getItemById);
router.post("/clients/create", clientsController.createItem);
router.patch("/clients/:id/update", clientsController.updateItem);
router.delete("/clients/:id/delete", clientsController.deleteItem);

export default router;
