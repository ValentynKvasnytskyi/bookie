export const ServiceSwaggerSchema = {
  components: {
    schemas: {
      Service: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the service.",
            example: "Massage Therapy",
          },
          description: {
            type: "string",
            description: "A brief description of the service.",
            example: "Relaxing full-body massage.",
          },
          image: {
            type: "string",
            description: "URL to an image representing the service.",
            example: "http://example.com/image.jpg",
            default: null,
          },
          price: {
            type: "number",
            description: "The price of the service.",
            example: 100.0,
          },
          duration: {
            type: "number",
            description: "Duration of the service in minutes.",
            example: 60,
          },
          category: {
            type: "string",
            description: "The ID of the category to which the service belongs.",
            format: "uuid",
            $ref: "#/components/schemas/Category",
            nullable: true,
          },
          isActive: {
            type: "boolean",
            description: "Indicates whether the service is active.",
            example: true,
            default: true,
          },
          companySlug: {
            type: "string",
            description: "A slug representing the company offering the service.",
            example: "example-company",
          },
        },
        required: ["name", "price", "duration", "companySlug"], // Mark required fields
      },
    },
  },
};
