import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  GetBatchRequest,
  FinalizeBatchRequest,
  GetRowRequest,
  GetColumnRequest,
  GetBulkSubmissionsRequest,
  BulkSubmissionPartialSummary,
} from './dto';
import {
  Address,
  Contact,
  PermitDetails,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
  CarrierDetail,
  ProducerDetail,
  ReceiverDetail,
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
    buildingNameOrNumber: { type: 'string' },
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
  optionalProperties: {
    fax: { type: 'string' },
  },
};

const permitDetails: JTDSchemaType<PermitDetails> = {
  properties: {
    authorizationType: { type: 'string' },
  },
  optionalProperties: {
    environmentalPermitNumber: { type: 'string' },
  },
};

export const producer: JTDSchemaType<ProducerDetail> = {
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
      enum: ['Household', 'Commercial'],
    },
    localAuthority: { type: 'string' },
    expectedWasteCollectionDate: wasteCollectionDate,
    address: address,
  },
  optionalProperties: {
    brokerRegistrationNumber: { type: 'string' },
    carrierRegistrationNumber: { type: 'string' },
  },
};

export const producerAndCollection: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: { properties: {} },
    Complete: {
      properties: {
        producer: producer,
        wasteCollection: wasteCollection,
      },
    },
  },
};

export const receiver: JTDSchemaType<ReceiverDetail> = {
  properties: {
    permitDetails: permitDetails,
    contact: contact,
    address: address,
  },
  optionalProperties: {},
};

export const carrier: JTDSchemaType<CarrierDetail> = {
  properties: {
    contact: contact,
    address: address,
  },
};

export const draftReceiver: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: { properties: {} },
    InProgress: {
      properties: {
        receiver,
      },
    },
    Completed: {
      properties: {
        receiver,
      },
    },
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

export const wasteInformation: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: { properties: {} },
    Complete: {
      properties: {
        wasteTypes: {
          elements: {
            ...wasteType,
          },
        },
        wasteTransportation: wasteTransportation,
      },
    },
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
        errorSummary: {
          properties: {
            rowBased: {
              elements: {
                properties: {
                  count: { type: 'int32' },
                  rowId: { type: 'string' },
                  rowNumber: { type: 'int32' },
                },
              },
            },
            columnBased: {
              elements: {
                properties: {
                  columnRef: { type: 'string' },
                  count: { type: 'int32' },
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
        rowsCount: { type: 'int32' },
      },
    },
    Submitting: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        transactionId: { type: 'string' },
      },
    },
    Submitted: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        transactionId: { type: 'string' },
        createdRowsCount: { type: 'int32' },
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

export const downloadCsvRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const downloadCsvResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: { data: { type: 'string' } } },
  },
};

export const getRowRequest: JTDSchemaType<GetRowRequest> = {
  properties: {
    accountId: { type: 'string' },
    batchId: { type: 'string' },
    rowId: { type: 'string' },
  },
};

export const getRowResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        id: { type: 'string' },
        batchId: { type: 'string' },
        accountId: { type: 'string' },
        messages: {
          elements: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const getColumnRequest: JTDSchemaType<GetColumnRequest> = {
  properties: {
    accountId: { type: 'string' },
    batchId: { type: 'string' },
    columnRef: { type: 'string' },
  },
};

export const getColumnResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        columnRef: { type: 'string' },
        batchId: { type: 'string' },
        accountId: { type: 'string' },
        errors: {
          elements: {
            properties: {
              rowNumber: { type: 'int32' },
              messages: {
                elements: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const getBulkSubmissionsRequest: JTDSchemaType<GetBulkSubmissionsRequest> =
  {
    properties: {
      accountId: { type: 'string' },
      batchId: { type: 'string' },
      page: { type: 'uint32' },
    },
    optionalProperties: {
      ewcCode: { type: 'string' },
      pageSize: { type: 'uint32' },
      wasteMovementId: { type: 'string' },
      producerName: { type: 'string' },
      collectionDate: { type: 'timestamp' },
    },
  };

const bulkSubmissionPartialSummary: JTDSchemaType<BulkSubmissionPartialSummary> =
  {
    properties: {
      id: { type: 'string' },
      wasteMovementId: { type: 'string' },
      ewcCode: { type: 'string' },
      collectionDate: {
        properties: {
          day: { type: 'string' },
          month: { type: 'string' },
          year: { type: 'string' },
        },
      },
      producerName: { type: 'string' },
    },
  };

export const getBulkSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        page: { type: 'int32' },
        totalPages: { type: 'int32' },
        totalRecords: { type: 'int32' },
        values: {
          elements: {
            ...bulkSubmissionPartialSummary,
          },
        },
      },
    },
  },
};
