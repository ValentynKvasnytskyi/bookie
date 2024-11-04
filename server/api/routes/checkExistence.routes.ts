import express from "express";
import CompaniesController from "../entities/companies/companies.controller.ts";

const router = express.Router();
const companiesController = new CompaniesController();

router.get("/company-exists", companiesController.checkExistence);

export default router;
