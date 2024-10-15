import { generateEntityRoutesSwagger } from "../generateEntityRoutesSwagger.ts";
export const ServicesRoutesSwagger = generateEntityRoutesSwagger("Service", "services", {
    filters: getServicesFilters(),
});
function getServicesFilters() {
    return [
        {
            name: "name",
            in: "query",
            schema: {
                type: "string",
            },
        },
        {
            name: "category",
            in: "query",
            schema: {
                type: "string",
            },
        },
        {
            name: "isActive",
            in: "query",
            schema: {
                type: "boolean",
            },
        },
        {
            name: "companySlug",
            in: "query",
            schema: {
                type: "string",
            },
        },
    ];
}
