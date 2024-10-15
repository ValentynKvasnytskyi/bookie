export const swaggerError500 = {
  description: "Internal server error",
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
