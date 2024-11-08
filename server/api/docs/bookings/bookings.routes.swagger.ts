import { FilterParameter, generateEntityRoutesSwagger } from "../generateEntityRoutesSwagger.ts";
export const BookingsRoutesSwagger = generateEntityRoutesSwagger("Booking", "bookings", {
  filters: getBookingsFilters(),
});

function getBookingsFilters(): FilterParameter[] {
  return [
    {
      name: "provider",
      in: "query",
      schema: { type: "string" },
    },
    {
      name: "service",
      in: "query",
      schema: { type: "string" },
    },
    {
      name: "services[]",
      in: "query",
      schema: {
        type: "array",
        items: {
          type: "string",
          style: "form",
          explode: true,
        },
      },
    },
    {
      name: "isDeclined",
      in: "query",
      schema: {
        type: "boolean",
      },
    },
    {
      name: "companySlug",
      in: "query",
      schema: {
        type: "string",
      },
    },
  ];
}
