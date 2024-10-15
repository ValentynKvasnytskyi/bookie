export const CategorySwaggerSchema = {
    components: {
        schemas: {
            Category: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description: "Category name",
                    },
                    description: {
                        type: "string",
                        description: "Category description",
                    },
                    isActive: {
                        type: "boolean",
                        description: "Is category active",
                        default: true,
                    },
                    companySlug: {
                        type: "string",
                        description: "Company slug",
                    },
                },
                required: ["name", "companySlug"],
            },
        },
    },
};
