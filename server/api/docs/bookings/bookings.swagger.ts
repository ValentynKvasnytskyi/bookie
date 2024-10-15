export const BookingSwaggerSchema = {
  components: {
    schemas: {
      Booking: {
        type: "object",
        properties: {
          provider: {
            type: "string",
            description: "ID of the provider",
            format: "objectid",
          },
          services: {
            type: "array",
            items: {
              type: "string",
              format: "objectid",
            },
            description: "Array of service IDs",
            nullable: true,
          },
          client: {
            type: "object",
            description: "Client information (mixed type in MongoDB)",
          },
          startDate: {
            type: "string",
            description: "Start date and time of the booking",
          },
          endDate: {
            type: "string",
            description: "End date and time of the booking",
          },
          clientComment: {
            type: "string",
            description: "Optional comment from the client",
          },
          isDeclined: {
            type: "boolean",
            description: "Whether the booking is declined",
            default: false,
          },
          companySlug: {
            type: "string",
            description: "Slug of the company",
          },
        },
        required: ["provider", "services", "client", "startDate", "endDate", "companySlug"],
      },
    },
  },
};
