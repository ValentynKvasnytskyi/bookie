import express from "express";
import BookingsController from "./bookings.controller.ts";

const POPULATE_FIELDS = ["services", "provider", "client"];

const router = express.Router();
const bookingsController = new BookingsController(POPULATE_FIELDS);

router.get("/bookings", bookingsController.getAll);
router.get("/bookings/:id", bookingsController.getItemById);
router.post("/bookings/create", bookingsController.createItem);
router.patch("/bookings/:id/update", bookingsController.updateItem);
router.delete("/bookings/:id/delete", bookingsController.deleteItem);

export default router;
