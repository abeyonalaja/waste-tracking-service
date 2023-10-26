import { SchemaObject } from 'ajv/dist/jtd';
import { errorResponseValue } from './submissionBase.schema';

export const getWasteCodesRequest: SchemaObject = {
  properties: {
    language: { type: 'string' },
  },
};

export const getEWCCodesRequest: SchemaObject = {
  properties: {
    language: { type: 'string' },
  },
};

export const getCountriesRequest: SchemaObject = {
  properties: {
    language: { type: 'string' },
  },
};

export const getRecoveryCodesRequest: SchemaObject = {
  properties: {
    language: { type: 'string' },
  },
};

export const getDisposalCodesRequest: SchemaObject = {
  properties: {
    language: { type: 'string' },
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
                description: { type: 'string' },
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
                description: { type: 'string' },
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
          description: { type: 'string' },
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
          description: { type: 'string' },
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
          isoCode: { type: 'string' },
          description: { type: 'string' },
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
          isoCode: { type: 'string' },
          description: { type: 'string' },
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
          description: { type: 'string' },
          interim: { type: 'boolean' },
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
          description: { type: 'string' },
          interim: { type: 'boolean' },
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
          description: { type: 'string' },
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
          description: { type: 'string' },
        },
      },
    },
  },
};
