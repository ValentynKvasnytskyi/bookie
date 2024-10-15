import { generateEntityRoutesSwagger } from "../generateEntityRoutesSwagger.ts";
export const CompaniesRoutesSwagger = generateEntityRoutesSwagger("Company", "companies", {
    filters: getCompaniesFilters(),
});
function getCompaniesFilters() {
    return [
        {
            name: "name",
            in: "query",
            schema: { type: "string" },
        },
        {
            name: "phoneNumber",
            in: "query",
            schema: { type: "string" },
        },
        {
            name: "slug",
            in: "query",
            schema: { type: "string" },
        },
    ];
}
