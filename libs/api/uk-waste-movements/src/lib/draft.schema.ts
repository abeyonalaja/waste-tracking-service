import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  Address,
  Contact,
  ExpectedWasteCollectionDate,
  ProducerDetail,
  WasteCollectionAddress,
  WasteTypeDetail,
  CarrierDetail,
} from './submission.dto';

import {
  DraftCarrierDetail,
  GetDraftsRequest,
  GetDraftsResult,
} from './draft.dto';

export const wasteType: JTDSchemaType<WasteTypeDetail> = {
  properties: {
    ewcCode: { type: 'string' },
    wasteDescription: { type: 'string' },
    physicalForm: {
      enum: ['Gas', 'Liquid', 'Solid', 'Sludge', 'Powder', 'Mixed'],
    },
    wasteQuantity: { type: 'float64' },
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

export const wasteTransportation: SchemaObject = {
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
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        wasteTypes: {
          elements: wasteType,
        },
        wasteTransportation: wasteTransportation,
      },
    },
  },
};

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

const draftReceiver: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        value: {
          properties: {
            authorizationType: { type: 'string' },
            contact: contact,
            address: address,
          },
          optionalProperties: {
            environmentalPermitNumber: { type: 'string' },
          },
        },
      },
    },
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

export const wasteCollectionAddress: JTDSchemaType<WasteCollectionAddress> = {
  optionalProperties: {
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
    postcode: { type: 'string' },
  },
};

export const wasteCollectionDate: JTDSchemaType<ExpectedWasteCollectionDate> = {
  properties: {
    day: { type: 'string' },
    month: { type: 'string' },
    year: { type: 'string' },
  },
};

export const wasteCollection: SchemaObject = {
  properties: {
    address: wasteCollectionAddress,
    wasteSource: {
      enum: ['Household', 'Commercial'],
    },
    localAuthority: { type: 'string' },
    expectedWasteCollectionDate: wasteCollectionDate,
  },
  optionalProperties: {
    brokerRegistrationNumber: { type: 'string' },
    carrierRegistrationNumber: { type: 'string' },
  },
};

export const producerAndWasteCollectionDetail: SchemaObject = {
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

export const carrier: JTDSchemaType<CarrierDetail> = {
  properties: {
    contact: contact,
    address: address,
  },
};

export const draftCarrier: JTDSchemaType<DraftCarrierDetail> = {
  discriminator: 'status',
  mapping: {
    NotStarted: { properties: {} },
    Complete: {
      properties: {
        value: carrier,
      },
    },
  },
};

export const submissionDeclarationDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    CannotStart: {
      properties: {},
    },
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        values: {
          properties: {
            declarationTimestamp: { type: 'timestamp' },
            transactionId: { type: 'string' },
          },
        },
      },
    },
  },
};

export const submissionStateDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    SubmittedWithEstimates: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    SubmittedWithActuals: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    UpdatedWithActuals: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
  },
};

export const draftSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    transactionId: { type: 'string' },
    wasteInformation: wasteInformation,
    receiver: draftReceiver,
    producerAndCollection: producerAndWasteCollectionDetail,
    carrier: draftCarrier,
    submissionDeclaration: submissionDeclarationDetail,
    submissionState: submissionStateDetail,
  },
};

export const getDraftResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const getDraftsRequest: JTDSchemaType<GetDraftsRequest> = {
  properties: {
    page: { type: 'int32' },
  },
  optionalProperties: {
    collectionDate: { type: 'timestamp' },
    ewcCode: { type: 'string' },
    producerName: { type: 'string' },
    wasteMovementId: { type: 'string' },
    pageSize: { type: 'int32' },
  },
};

const getDraftsResult: JTDSchemaType<GetDraftsResult> = {
  properties: {
    totalRecords: { type: 'int32' },
    totalPages: { type: 'int32' },
    page: { type: 'int32' },
    values: {
      elements: {
        properties: {
          id: { type: 'string' },
          wasteMovementId: { type: 'string' },
          producerName: { type: 'string' },
          ewcCode: { type: 'string' },
          collectionDate: {
            properties: {
              day: { type: 'string' },
              month: { type: 'string' },
              year: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const getDraftsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: getDraftsResult,
  },
};
