export const CompanySwaggerSchema = {
  components: {
    schemas: {
      Company: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the company",
          },
          description: {
            type: "string",
            description: "Description of the company",
          },
          phoneNumber: {
            type: "string",
            description: "Phone number of the company",
          },
          image: {
            type: "string",
            description: "URL or path to the company's image",
          },
          schedule: {
            type: "string",
            format: "objectid",
            description: "ID of the associated schedule",
          },
          slug: {
            type: "string",
            description: "Unique slug for the company",
          },
        },
        required: ["name", "phoneNumber", "slug"],
      },
    },
  },
};
