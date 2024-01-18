import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import { AddBatchContentRequest, GetBatchContentRequest } from './dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
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
    FailedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        errors: {
          elements: {
            properties: {
              rowNumber: { type: 'float64' },
              errorAmount: { type: 'float64' },
              errorDescriptions: { elements: { type: 'string' } },
            },
          },
        },
      },
    },
    PassedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        drafts: {
          elements: {
            properties: {
              id: { type: 'string' },
            },
          },
        },
      },
    },
    Submitted: {
      properties: {
        timestamp: { type: 'timestamp' },
        submissions: {
          elements: {
            properties: {
              id: { type: 'string' },
              transactionNumber: { type: 'string' },
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

export const addBatchContentRequest: JTDSchemaType<AddBatchContentRequest> = {
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

export const addBatchContentResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: bulkSubmission,
  },
};

export const getBatchContentRequest: JTDSchemaType<GetBatchContentRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getBatchContentResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: bulkSubmission,
  },
};
