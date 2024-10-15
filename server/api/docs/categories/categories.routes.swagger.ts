import { FilterParameter, generateEntityRoutesSwagger } from "../generateEntityRoutesSwagger.ts";
export const CategoriesRoutesSwagger = generateEntityRoutesSwagger("Category", "categories", {
  filters: getCategoriesFilters(),
});

function getCategoriesFilters(): FilterParameter[] {
  return [
    {
      name: "name",
      in: "query",
      schema: { type: "string" },
    },
    {
      name: "isActive",
      in: "query",
      schema: { type: "boolean" },
    },
    {
      name: "companySlug",
      in: "query",
      schema: { type: "string" },
    },
  ];
}
