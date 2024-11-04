export const ProviderSwaggerSchema = {
  components: {
    schemas: {
      Provider: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the providerss",
          },
          companySlug: {
            type: "string",
            description: "Slug of the company the providerss belongs to",
          },
          description: {
            type: "string",
            description: "Description of the providerss",
          },
          phoneNumber: {
            type: "string",
            description: "Phone number of the providerss",
          },
          email: {
            type: "string",
            description: "Email address of the providerss",
          },
          isActive: {
            type: "boolean",
            description: "Whether the providerss is active or not",
          },
          image: {
            type: "string",
            description: "URL of the providerss's image",
          },
          services: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Array of service IDs associated with the providerss",
            nullable: true,
          },
          schedule: {
            type: "string",
            description: "ID of the schedules associated with the providerss",
            nullable: true,
          },
        },
        required: ["name", "companySlug", "schedule"],
      },
    },
  },
};
