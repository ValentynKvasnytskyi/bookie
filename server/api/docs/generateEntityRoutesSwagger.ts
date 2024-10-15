import { swaggerCollection200 } from "./swaggerResponses/swagger.collection.200.ts";
import { swaggerError500 } from "./swaggerResponses/swagger.error.500.ts";
import { swaggerItemParameters } from "./swaggerResponses/swagger.item.parameters.ts";
import { swaggerItem200 } from "./swaggerResponses/swagger.item.200.ts";
import { swaggerError404 } from "./swaggerResponses/swagger.error.404.ts";
import { swaggerError400 } from "./swaggerResponses/swagger.error.400.ts";
import { swaggerItemDelete200 } from "./swaggerResponses/swagger.item.delete.200.ts";

const irregularPlurals: { [key: string]: string } = {
  Category: "Categories",
  Company: "Companies",
};

export function generateEntityRoutesSwagger(entityName: string, basePath: string, config: EntityConfig = {}) {
  const pluralEntityName = getPlural(entityName);
  let filters = getDefaultFilters();

  if (config.filters) {
    filters = [...filters, ...config.filters];
  }

  return {
    [`/api/${basePath}`]: {
      get: {
        summary: `Retrieve all ${pluralEntityName.toLowerCase()}`,
        tags: [pluralEntityName],
        parameters: filters,
        responses: {
          200: swaggerCollection200(entityName),
          500: swaggerError500,
        },
      },
    },
    [`/api/${basePath}/{id}`]: {
      get: {
        summary: `Retrieve a ${entityName.toLowerCase()} by ID`,
        tags: [pluralEntityName],
        parameters: [...swaggerItemParameters(entityName, "retrieve")],
        responses: {
          200: swaggerItem200(entityName, "retrieved"),
          404: swaggerError404(entityName),
          500: swaggerError500,
        },
      },
    },
    [`/api/${basePath}/create`]: {
      post: {
        summary: `Create a new ${entityName.toLowerCase()}`,
        tags: [pluralEntityName],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${entityName}`,
              },
            },
          },
        },
        responses: {
          201: swaggerItem200(entityName, "created"),
          400: swaggerError400,
        },
      },
    },
    [`/api/${basePath}/{id}/update`]: {
      patch: {
        summary: `Update a ${entityName.toLowerCase()} by ID`,
        tags: [pluralEntityName],
        parameters: [...swaggerItemParameters(entityName, "update")],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${entityName}`,
              },
            },
          },
        },
        responses: {
          200: swaggerItem200(entityName, "updated"),
          404: swaggerError404(entityName),
          500: swaggerError500,
        },
      },
    },
    [`/api/${basePath}/{id}/delete`]: {
      delete: {
        summary: `Delete a ${entityName.toLowerCase()} by ID`,
        tags: [pluralEntityName],
        parameters: [...swaggerItemParameters(entityName, "delete")],
        responses: {
          200: swaggerItemDelete200(entityName),
          404: swaggerError404(entityName),
          500: swaggerError500,
        },
      },
    },
  };
}

function getPlural(entityName: string): string {
  return irregularPlurals[entityName] || `${entityName}s`;
}

export interface FilterParameter {
  name: string;
  in: string;
  description?: string;
  schema: {
    type: string;
    items?: {
      type: string;
      style?: string;
      explode?: boolean;
    };
  };
}

interface EntityConfig {
  filters?: FilterParameter[];
}

function getDefaultFilters(): FilterParameter[] {
  return [
    {
      name: "page",
      in: "query",
      schema: {
        type: "string",
      },
    },
    {
      name: "limit",
      in: "query",
      schema: {
        type: "string",
      },
    },
    {
      name: "pagination",
      in: "query",
      schema: {
        type: "boolean",
      },
    },
  ];
}
