export const ProviderSwaggerSchema = {
  components: {
    schemas: {
      Provider: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the provider",
          },
          companySlug: {
            type: "string",
            description: "Slug of the company the provider belongs to",
          },
          description: {
            type: "string",
            description: "Description of the provider",
          },
          phoneNumber: {
            type: "string",
            description: "Phone number of the provider",
          },
          email: {
            type: "string",
            description: "Email address of the provider",
          },
          isActive: {
            type: "boolean",
            description: "Whether the provider is active or not",
          },
          image: {
            type: "string",
            description: "URL of the provider's image",
          },
          services: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Array of service IDs associated with the provider",
            nullable: true,
          },
          schedule: {
            type: "string",
            description: "ID of the schedules associated with the provider",
            nullable: true,
          },
        },
        required: ["name", "companySlug", "schedule"],
      },
    },
  },
};
