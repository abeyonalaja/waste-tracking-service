import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  GetBatchRequest,
  FinalizeBatchRequest,
} from './dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const address: SchemaObject = {
  properties: {
    addressLine1: { type: 'string' },
    townCity: { type: 'string' },
    postcode: { type: 'string' },
    country: { type: 'string' },
  },
  optionalProperties: {
    addressLine2: { type: 'string' },
  },
};

const contact: SchemaObject = {
  properties: {
    organisationName: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
  },
  optionalProperties: {},
};

export const producer: SchemaObject = {
  properties: {
    reference: { type: 'string' },
    sicCode: { type: 'string' },
    contact: contact,
    address: address,
  },
};

const bulkSubmissionState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    Processing: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    FailedCsvValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        error: { type: 'string' },
      },
    },
    FailedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        rowErrors: {
          elements: {
            properties: {
              rowNumber: { type: 'uint16' },
              errorAmount: { type: 'uint16' },
              errorDetails: { elements: { type: 'string' } },
            },
          },
        },
        columnErrors: {
          elements: {
            properties: {
              errorAmount: { type: 'uint16' },
              columnName: { type: 'string' },
              errorDetails: {
                elements: {
                  properties: {
                    rowNumber: { type: 'uint16' },
                    errorReason: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    PassedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        submissions: {
          elements: {
            properties: {
              producer: producer,
              wasteTypeDetails: {
                elements: {
                  properties: {
                    ewcCode: { type: 'string' },
                    wasteDescription: { type: 'string' },
                    physicalForm: { type: 'string' },
                    wasteQuantity: { type: 'uint16' },
                    quantityUnits: { type: 'string' },
                    wasteQuantityType: { type: 'string' },
                    haveHazardousProperties: { type: 'boolean' },
                    containsPop: { type: 'boolean' },
                    hazardousPropertiesCode: { type: 'string' },
                    popDetails: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    Submitted: {
      properties: {
        timestamp: { type: 'timestamp' },
        transactionId: { type: 'string' },
        submissions: {
          elements: {
            properties: {
              id: { type: 'string' },
              transactionId: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const bulkSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    state: bulkSubmissionState,
  },
};

export const addContentToBatchRequest: JTDSchemaType<AddContentToBatchRequest> =
  {
    properties: {
      accountId: { type: 'string' },
      content: {
        properties: {
          type: { enum: ['text/csv'] },
          compression: { enum: ['Snappy', 'None'] },
          value: { type: 'string' },
        },
      },
    },
    optionalProperties: {
      batchId: { type: 'string' },
    },
  };

export const addContentToBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        batchId: { type: 'string' },
      },
    },
  },
};

export const getBatchRequest: JTDSchemaType<GetBatchRequest> = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
  },
};

export const finalizeBatchRequest: JTDSchemaType<FinalizeBatchRequest> = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
  },
};

export const getBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: bulkSubmission,
  },
};

export const finalizeBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};
