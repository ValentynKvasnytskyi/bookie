import { generateEntityRoutesSwagger } from "../generateEntityRoutesSwagger.ts";
export const ProvidersRoutesSwagger = generateEntityRoutesSwagger("Provider", "providers", {
    filters: getProvidersFilters(),
});
function getProvidersFilters() {
    return [
        {
            name: "name",
            in: "query",
            schema: {
                type: "string",
            },
        },
        {
            name: "companySlug",
            in: "query",
            schema: {
                type: "string",
            },
        },
        {
            name: "phoneNumber",
            in: "query",
            schema: {
                type: "string",
            },
        },
        {
            name: "email",
            in: "query",
            schema: {
                type: "string",
            },
        },
        {
            name: "services[]",
            in: "query",
            schema: {
                type: "array",
                items: {
                    type: "string",
                    style: "form",
                    explode: true,
                },
            },
        },
    ];
}
