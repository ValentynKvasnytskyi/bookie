export const ClientSwaggerSchema = {
    components: {
        schemas: {
            Client: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description: "Name of the client",
                    },
                    email: {
                        type: "string",
                        description: "Email address of the client",
                    },
                    phoneNumber: {
                        type: "string",
                        description: "Phone number of the client",
                    },
                    isBlocked: {
                        type: "boolean",
                        description: "Whether the client is blocked",
                        default: false,
                    },
                    companySlug: {
                        type: "string",
                        description: "Slug of the company the client belongs to",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "Timestamp of when the client was created",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "Timestamp of when the client was last updated",
                    },
                },
                required: ["name", "email", "phoneNumber", "companySlug"],
            },
        },
    },
};
