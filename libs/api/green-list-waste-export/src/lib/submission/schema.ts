import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  CancelSubmissionRequest,
  Carrier,
  CollectionDateData,
  CollectionDateType,
  CollectionDetail,
  EwcCode,
  ExporterDetail,
  GetBulkSubmissionsRequest,
  GetCollectionDateRequest,
  GetSubmissionRequest,
  GetWasteQuantityRequest,
  ImporterDetail,
  RecoveryFacilityDetail,
  RecoveryFacilityType,
  SubmissionDeclaration,
  SubmissionStateStatus,
  TransportDetail,
  WasteQuantity,
  WasteQuantityData,
  WasteQuantityType,
} from './dto';
import {
  addressDetail,
  cancellationType,
  contactDetail,
  customerReference,
  errorResponseValue,
  optionalStringInput,
  recordState,
  ukAddressDetail,
  ukContactDetail,
} from '../common/schema';

export const ewcCode: JTDSchemaType<EwcCode> = {
  properties: {
    code: {
      type: 'string',
    },
  },
};

export const wasteCode: SchemaObject = {
  discriminator: 'type',
  mapping: {
    BaselAnnexIX: { properties: { code: { type: 'string' } } },
    OECD: { properties: { code: { type: 'string' } } },
    AnnexIIIA: { properties: { code: { type: 'string' } } },
    AnnexIIIB: { properties: { code: { type: 'string' } } },
    NotApplicable: { properties: {} },
  },
};

export const nationalCode = optionalStringInput;

export const wasteQuantityType: JTDSchemaType<WasteQuantityType> = {
  enum: ['EstimateData', 'ActualData'],
};

export const wasteQuantityData: JTDSchemaType<WasteQuantityData> = {
  properties: {
    quantityType: { enum: ['Volume', 'Weight'] },
    unit: {
      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
    },
    value: { type: 'float64' },
  },
};

export const collectionDateType: JTDSchemaType<CollectionDateType> = {
  enum: ['EstimateDate', 'ActualDate'],
};

export const collectionDateData: JTDSchemaType<CollectionDateData> = {
  properties: {
    day: { type: 'string' },
    month: { type: 'string' },
    year: { type: 'string' },
  },
};

export const transportDetail: JTDSchemaType<TransportDetail> = {
  properties: {
    type: { enum: ['Road', 'Air', 'Sea', 'Rail', 'InlandWaterways'] },
  },
  optionalProperties: {
    description: { type: 'string' },
  },
};

export const recoveryFacilityType: JTDSchemaType<RecoveryFacilityType> = {
  discriminator: 'type',
  mapping: {
    Laboratory: {
      properties: {
        disposalCode: { type: 'string' },
      },
    },
    InterimSite: {
      properties: {
        recoveryCode: { type: 'string' },
      },
    },
    RecoveryFacility: {
      properties: {
        recoveryCode: { type: 'string' },
      },
    },
  },
};

export const submissionStateStatus: JTDSchemaType<SubmissionStateStatus> = {
  enum: [
    'SubmittedWithEstimates',
    'SubmittedWithActuals',
    'UpdatedWithActuals',
  ],
};

export const wasteDescription: SchemaObject = {
  properties: {
    wasteCode,
    ewcCodes: {
      elements: {
        ...ewcCode,
      },
    },
    description: { type: 'string' },
  },
  optionalProperties: {
    nationalCode,
  },
};

export const wasteQuantity: JTDSchemaType<WasteQuantity> = {
  properties: {
    type: wasteQuantityType,
    estimateData: {
      optionalProperties: {
        ...wasteQuantityData.properties,
      },
    },
    actualData: {
      optionalProperties: {
        ...wasteQuantityData.properties,
      },
    },
  },
};

export const exporterDetail: JTDSchemaType<ExporterDetail> = {
  properties: {
    exporterAddress: ukAddressDetail,
    exporterContactDetails: ukContactDetail,
  },
};

export const importerDetail: JTDSchemaType<ImporterDetail> = {
  properties: {
    importerAddressDetails: addressDetail,
    importerContactDetails: contactDetail,
  },
};

export const collectionDate: SchemaObject = {
  properties: {
    type: collectionDateType,
    estimateDate: {
      optionalProperties: {
        ...collectionDateData.properties,
      },
    },
    actualDate: {
      optionalProperties: {
        ...collectionDateData.properties,
      },
    },
  },
};

export const carrier: JTDSchemaType<Carrier> = {
  properties: {
    addressDetails: addressDetail,
    contactDetails: contactDetail,
  },
  optionalProperties: {
    transportDetails: transportDetail,
  },
};

export const carriers: JTDSchemaType<Carrier[]> = {
  elements: {
    ...carrier,
  },
};

export const collectionDetail: JTDSchemaType<CollectionDetail> = {
  properties: {
    address: ukAddressDetail,
    contactDetails: ukContactDetail,
  },
};

export const ukExitLocation: SchemaObject = {
  discriminator: 'provided',
  mapping: {
    Yes: { properties: { value: { type: 'string' } } },
    No: { properties: {} },
  },
};

export const transitCountries: SchemaObject = {
  elements: { type: 'string' },
};

export const recoveryFacilityDetail: JTDSchemaType<RecoveryFacilityDetail> = {
  properties: {
    addressDetails: {
      properties: {
        name: addressDetail.properties.organisationName,
        address: addressDetail.properties.address,
        country: addressDetail.properties.country,
      },
    },
    contactDetails: contactDetail,
    recoveryFacilityType,
  },
};

export const recoveryFacilityDetails: JTDSchemaType<RecoveryFacilityDetail[]> =
  {
    elements: {
      ...recoveryFacilityDetail,
    },
  };

export const submissionDeclaration: JTDSchemaType<SubmissionDeclaration> = {
  properties: {
    declarationTimestamp: { type: 'timestamp' },
    transactionId: { type: 'string' },
  },
};

export const submissionState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    Cancelled: {
      properties: {
        timestamp: { type: 'timestamp' },
        cancellationType: cancellationType,
      },
    },
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

export const submission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    reference: customerReference,
    wasteDescription,
    wasteQuantity,
    exporterDetail,
    importerDetail,
    collectionDate,
    carriers,
    collectionDetail,
    ukExitLocation,
    transitCountries,
    recoveryFacilityDetail: recoveryFacilityDetails,
    submissionDeclaration,
    submissionState,
  },
};

export const getSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        totalRecords: { type: 'uint16' },
        totalPages: { type: 'uint16' },
        currentPage: { type: 'uint16' },
        pages: {
          elements: {
            properties: {
              pageNumber: { type: 'uint16' },
              token: { type: 'string' },
            },
          },
        },
        values: {
          elements: {
            properties: {
              id: { type: 'string' },
              reference: customerReference,
              wasteDescription: wasteDescription,
              collectionDate: collectionDate,
              submissionDeclaration: submissionDeclaration,
              submissionState: recordState,
            },
          },
        },
      },
    },
  },
};

export const getSubmissionRequest: JTDSchemaType<GetSubmissionRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getSubmissionResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: submission,
  },
};

export const getWasteQuantityRequest: JTDSchemaType<GetWasteQuantityRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getWasteQuantityResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: wasteQuantity,
  },
};

export const setWasteQuantityRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: wasteQuantity,
  },
};

export const setWasteQuantityResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getCollectionDateRequest: JTDSchemaType<GetCollectionDateRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getCollectionDateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: collectionDate,
  },
};

export const setCollectionDateRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: collectionDate,
  },
};

export const setCollectionDateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const cancelSubmissionRequest: JTDSchemaType<CancelSubmissionRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    cancellationType: cancellationType,
  },
};

export const cancelSubmissionResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getNumberOfSubmissionsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
  },
};

export const getNumberOfSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        complete: { type: 'uint16' },
        incomplete: { type: 'uint16' },
        completeWithEstimates: { type: 'uint16' },
      },
    },
  },
};

export const createSubmissionsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
    values: {
      elements: {
        properties: {
          reference: customerReference,
          wasteDescription: wasteDescription,
          wasteQuantity: wasteQuantity,
          exporterDetail: exporterDetail,
          importerDetail: importerDetail,
          collectionDate: collectionDate,
          carriers: carriers,
          collectionDetail: collectionDetail,
          ukExitLocation: ukExitLocation,
          transitCountries: transitCountries,
          recoveryFacilityDetail: recoveryFacilityDetails,
        },
      },
    },
  },
};

export const getBulkSubmissionsRequest: JTDSchemaType<GetBulkSubmissionsRequest> =
  {
    properties: {
      accountId: { type: 'string' },
      submissionIds: {
        elements: { type: 'string' },
      },
    },
  };

export const getBulkSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        ...submission,
      },
    },
  },
};
