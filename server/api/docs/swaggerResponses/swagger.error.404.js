export function swaggerError404(entityName) {
    return {
        description: `${entityName} not found`,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: `ID of the ${entityName}`,
                        },
                        message: {
                            type: "string",
                            description: "Error message",
                        },
                    },
                },
            },
        },
    };
}
