import { CategorySwaggerSchema } from "./categories/category.swagger.ts";
import { CategoriesRoutesSwagger } from "./categories/categories.routes.swagger.ts";
import { ServiceSwaggerSchema } from "./services/service.swagger.ts";
import { ServicesRoutesSwagger } from "./services/services.routes.swagger.ts";
import { SchedulesRoutesSwagger } from "./schedules/schedules.routes.swagger.ts";
import { ProviderSwaggerSchema } from "./providers/providers.swagger.ts";
import { ProvidersRoutesSwagger } from "./providers/providers.routes.swagger.ts";
import { ScheduleSwaggerSchema } from "./schedules/schedules.swagger.ts";
import { BookingsRoutesSwagger } from "./bookings/bookings.routes.swagger.ts";
import { ClientsRoutesSwagger } from "./clients/clients.routes.swagger.ts";
import { CompaniesRoutesSwagger } from "./companies/companies.routes.swagger.ts";
import { BookingSwaggerSchema } from "./bookings/bookings.swagger.ts";
import { ClientSwaggerSchema } from "./clients/clients.swagger.ts";
import { CompanySwaggerSchema } from "./companies/companies.swagger.ts";
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Bookie API",
            version: "1.0.0",
            description: "API documentation",
        },
        components: {
            schemas: {
                ...CategorySwaggerSchema.components.schemas,
                ...ServiceSwaggerSchema.components.schemas,
                ...ScheduleSwaggerSchema.components.schemas,
                ...ProviderSwaggerSchema.components.schemas,
                ...BookingSwaggerSchema.components.schemas,
                ...ClientSwaggerSchema.components.schemas,
                ...CompanySwaggerSchema.components.schemas,
            },
        },
    },
    apis: [], // No need to specify APIs if you're manually merging schemas and paths
};
const swaggerDocs = {
    ...swaggerOptions.swaggerDefinition,
    paths: {
        ...CategoriesRoutesSwagger,
        ...ServicesRoutesSwagger,
        ...SchedulesRoutesSwagger,
        ...ProvidersRoutesSwagger,
        ...BookingsRoutesSwagger,
        ...ClientsRoutesSwagger,
        ...CompaniesRoutesSwagger,
    },
};
export default swaggerDocs;
