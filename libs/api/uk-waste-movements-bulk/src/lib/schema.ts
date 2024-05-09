import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  GetBatchRequest,
  FinalizeBatchRequest,
} from './dto';
import {
  Address,
  Contact,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
} from '@wts/api/uk-waste-movements';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const wasteCollectionDate: JTDSchemaType<ExpectedWasteCollectionDate> = {
  properties: {
    day: { type: 'string' },
    month: { type: 'string' },
    year: { type: 'string' },
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

export const wasteCollection: SchemaObject = {
  properties: {
    wasteSource: {
      enum: [
        'Household',
        'LocalAuthority',
        'Construction',
        'Demolition',
        'Commercial',
        'Industrial',
      ],
    },
    modeOfWasteTransport: {
      enum: ['Road', 'Rail', 'Sea', 'Air', 'InlandWaterways'],
    },
    expectedWasteCollectionDate: wasteCollectionDate,
    address: address,
  },
  optionalProperties: {
    brokerRegistrationNumber: { type: 'string' },
    carrierRegistrationNumber: { type: 'string' },
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

export const wasteType: JTDSchemaType<WasteTypeDetail> = {
  properties: {
    ewcCode: { type: 'string' },
    wasteDescription: { type: 'string' },
    physicalForm: {
      enum: ['Gas', 'Liquid', 'Solid', 'Sludge', 'Powder', 'Mixed'],
    },
    wasteQuantity: { type: 'uint16' },
    quantityUnit: {
      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
    },
    wasteQuantityType: { enum: ['EstimateData', 'ActualData'] },
    hasHazardousProperties: { type: 'boolean' },
    containsPops: { type: 'boolean' },
    chemicalAndBiologicalComponents: {
      elements: {
        properties: {
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: { type: 'string' },
        },
      },
    },
  },
  optionalProperties: {
    hazardousWasteCodes: {
      elements: {
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
    pops: {
      elements: {
        properties: {
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: { type: 'string' },
        },
      },
    },
  },
};

export const wasteTransportation: JTDSchemaType<WasteTransportationDetail> = {
  properties: {
    numberAndTypeOfContainers: { type: 'string' },
  },
  optionalProperties: {
    specialHandlingRequirements: { type: 'string' },
  },
};

const submissionDeclaration: SchemaObject = {
  properties: {
    transactionId: { type: 'string' },
    declarationTimestamp: { type: 'timestamp' },
  },
};

const submissionState: SchemaObject = {
  properties: {
    status: { type: 'string' },
    timestamp: { type: 'timestamp' },
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
              receiver,
              producer,
              wasteCollection,
              wasteTransportation,
              wasteTypes: {
                elements: {
                  ...wasteType,
                },
              },
            },
          },
        },
      },
    },
    Submitting: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        transactionId: { type: 'string' },
        submissions: {
          elements: {
            properties: {
              receiver,
              producer,
              wasteCollection,
              wasteTransportation,
              wasteTypes: {
                elements: {
                  ...wasteType,
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
        hasEstimates: { type: 'boolean' },
        transactionId: { type: 'string' },
        submissions: {
          elements: {
            properties: {
              id: { type: 'string' },
              producer,
              wasteCollection,
              wasteTypes: {
                elements: {
                  ...wasteType,
                },
              },
              submissionDeclaration,
              submissionState,
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
