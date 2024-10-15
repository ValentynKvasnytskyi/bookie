export function swaggerItem200(entityName: string, action: string) {
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
