export function swaggerItemDelete200(entityName: string) {
  return {
    description: `${entityName} successfully deleted`,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "OK",
            },
          },
        },
        example: {
          status: "OK",
        },
      },
    },
  };
}
