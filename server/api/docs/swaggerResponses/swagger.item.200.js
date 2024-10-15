export function swaggerItem200(entityName, action) {
    return {
        description: `${entityName} successfully ${action}`,
        content: {
            "application/json": {
                schema: {
                    $ref: `#/components/schemas/${entityName}`,
                },
            },
        },
    };
}
