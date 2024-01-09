import { SchemaObject } from 'ajv/dist/jtd';

export const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const getWasteCodes: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          type: { type: 'string' },
          values: {
            elements: {
              properties: {
                code: { type: 'string' },
                value: {
                  properties: {
                    description: {
                      properties: {
                        en: { type: 'string' },
                        cy: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const GetWasteCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          type: { type: 'string' },
          values: {
            elements: {
              properties: {
                code: { type: 'string' },
                value: {
                  properties: {
                    description: {
                      properties: {
                        en: { type: 'string' },
                        cy: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getEWCCodes: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const GetEWCCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getCountries: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          name: { type: 'string' },
        },
      },
    },
  },
};

export const GetCountriesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          name: { type: 'string' },
        },
      },
    },
  },
};

export const getRecoveryCodes: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
              interim: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
};

export const GetRecoveryCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
              interim: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
};

export const getDisposalCodes: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const GetDisposalCodesResponse: SchemaObject = {
  properties: {
    success: {
      type: 'boolean',
    },
  },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          code: { type: 'string' },
          value: {
            properties: {
              description: {
                properties: {
                  en: { type: 'string' },
                  cy: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};
