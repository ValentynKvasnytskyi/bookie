import { generateEntityRoutesSwagger } from "../generateEntityRoutesSwagger.ts";
export const ClientsRoutesSwagger = generateEntityRoutesSwagger("Client", "clients", {
    filters: getClientsFilters(),
});
function getClientsFilters() {
    return [
        {
            name: "name",
            in: "query",
            schema: { type: "string" },
        },
        {
            name: "email",
            in: "query",
            schema: { type: "string" },
        },
        {
            name: "phoneNumber",
            in: "query",
            schema: { type: "string" },
        },
        {
            name: "companySlug",
            in: "query",
            schema: { type: "string" },
        },
    ];
}
