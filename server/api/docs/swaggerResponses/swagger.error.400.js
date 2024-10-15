export const swaggerError400 = {
    description: "Invalid request body",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    error: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "Error",
                            },
                        },
                    },
                },
            },
        },
    },
};
