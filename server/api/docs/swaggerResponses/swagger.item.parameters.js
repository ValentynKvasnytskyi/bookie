export function swaggerItemParameters(entityName, action) {
    return [
        {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "string",
                description: `ID of the ${entityName} to ${action}`,
            },
        },
    ];
}
