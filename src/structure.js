export default {
  default: {
    profile: {
      type: "object",
      schemaChildren: {
        name: { type: "string" },
        specialty: { type: "string" },
        address: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
      },
    },
    summary: {
      type: "string",
    },
    social: {
      type: "array",
      elements: {
        type: "object",
        schemaChildren: {
          web: { type: "string" },
          url: { type: "string" },
        },
      },
    },
    education: {
      type: "array",
      elements: {
        type: "object",
        schemaChildren: {
          degree: { type: "string" },
          fieldOfStudy: { type: "string" },
          schoolName: { type: "string" },
          notes: {
            type: "string",
          },
          startDate: {
            type: "object",
            schemaChildren: {
              year: { type: "number" },
            },
          },
          endDate: {
            type: "object",
            schemaChildren: {
              year: { type: "number" },
            },
          },
        },
      },
    },
    skills: {
      type: "array",
      elements: {
        type: "string",
      },
    },
    experiences: {
      type: "array",
      elements: {
        type: "object",
        schemaChildren: {
          isCurrent: { type: "boolean" },
          summary: { type: "string" },
          title: { type: "string" },
          endDate: {
            type: "object",
            schemaChildren: {
              month: { type: "number" },
              year: { type: "number" },
            },
          },
          startDate: {
            type: "object",
            schemaChildren: {
              month: { type: "number" },
              year: { type: "number" },
            },
          },
          company: {
            type: "object",
            schemaChildren: {
              name: { type: "string" },
              address: { type: "string" },
            },
          },
        },
      },
    },
    achievements: {
      type: "array",
      elements: {
        type: "object",
        schemaChildren: {
          issuer: { type: "string" },
          name: { type: "string" },
        },
      },
    },
  },
};
