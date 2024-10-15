export function swaggerCollection200(entityName: string) {
  return {
    description: `Retrieves ${entityName} entities collection`,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              $ref: `#/components/schemas/${entityName}`,
            },
            totalCount: {
              type: "number",
            },
          },
        },
      },
    },
  };
}
