import express from "express";
import CategoriesRoutes from "../entities/categories/categories.routes.ts";
import ServicesRoutes from "../entities/services/services.routes.ts";
import SchedulesRoutes from "../entities/schedules/schedules.routes.ts";
import ProvidersRoutes from "../entities/providers/providers.routes.ts";
import CompaniesRoutes from "../entities/companies/companies.routes.ts";
import ClientsRoutes from "../entities/clients/clients.routes.ts";
import BookingsRoutes from "../entities/bookings/bookings.routes.ts";

const router = express.Router();

router.use(CategoriesRoutes);
router.use(ServicesRoutes);
router.use(SchedulesRoutes);
router.use(ProvidersRoutes);
router.use(CompaniesRoutes);
router.use(ClientsRoutes);
router.use(BookingsRoutes);
export default router;
