import express from "express";
import SchedulesController from "./schedules.controller.ts";

const router = express.Router();
const schedulesController = new SchedulesController();

router.get("/schedules", schedulesController.getAll);
router.get("/schedules/:id", schedulesController.getItemById);
router.post("/schedules/create", schedulesController.createItem);
router.patch("/schedules/:id/update", schedulesController.updateItem);
router.delete("/schedules/:id/delete", schedulesController.deleteItem);

export default router;
