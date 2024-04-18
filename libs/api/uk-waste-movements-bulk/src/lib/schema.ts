import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  GetBatchRequest,
  FinalizeBatchRequest,
} from './dto';
import {
  Address,
  Contact,
  WasteTransportationDetails,
  WasteTypeDetails,
} from '@wts/api/uk-waste-movements';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const address: JTDSchemaType<Address> = {
  properties: {
    addressLine1: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
  },
  optionalProperties: {
    addressLine2: { type: 'string' },
    postcode: { type: 'string' },
  },
};

const contact: JTDSchemaType<Contact> = {
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
    contact: contact,
    address: address,
  },
  optionalProperties: {
    sicCode: { type: 'string' },
  },
};

export const receiver: SchemaObject = {
  properties: {
    authorizationType: { type: 'string' },
    environmentalPermitNumber: { type: 'string' },
    contact: contact,
    address: address,
  },
};

export const wasteTypeDetails: JTDSchemaType<WasteTypeDetails> = {
  properties: {
    ewcCode: { type: 'string' },
    wasteDescription: { type: 'string' },
    physicalForm: {
      enum: ['Gas', 'Liquid', 'Solid', 'Sludge', 'Powder', 'Mixed'],
    },
    wasteQuantity: { type: 'uint16' },
    quantityUnits: {
      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
    },
    wasteQuantityType: { enum: ['EstimateData', 'ActualData'] },
    hasHazardousProperties: { type: 'boolean' },
    containsPops: { type: 'boolean' },
  },
  optionalProperties: {
    hazardousWasteCodes: {
      elements: {
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: {
            enum: ['Microgram', 'Milligram', 'Kilogram'],
          },
          unIdentificationNumber: { type: 'string' },
          properShippingName: { type: 'string' },
          unClass: { type: 'string' },
          packageGroup: { type: 'string' },
          specialHandlingRequirements: { type: 'string' },
        },
      },
    },
    pops: {
      elements: {
        properties: {
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: {
            enum: ['Microgram', 'Milligram', 'Kilogram'],
          },
        },
      },
    },
  },
};

export const wasteTransportationDetails: JTDSchemaType<WasteTransportationDetails> =
  {
    properties: {
      numberAndTypeOfContainers: { type: 'string' },
    },
    optionalProperties: {
      specialHandlingRequirements: { type: 'string' },
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
              receiver: receiver,
              producer: producer,
              wasteTransportationDetails,
              wasteTypeDetails: {
                elements: {
                  ...wasteTypeDetails,
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
              reference: { type: 'string' },
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
