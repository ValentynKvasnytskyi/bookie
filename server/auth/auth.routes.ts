import express from "express";
import AuthController from "./index.ts";
import { authenticateToken } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/logout", authenticateToken, AuthController.logout);
router.post("/auth/refresh-token", AuthController.tokenRefresh);

export default router;
