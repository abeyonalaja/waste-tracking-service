import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  collectionDateType,
  ewcCode,
  nationalCode,
  recoveryFacilityType,
  transitCountries,
  transportDetail,
  wasteCode,
} from '../submission/schema';
import {
  CreateDraftCarriersRequest,
  CreateDraftRecoveryFacilityDetailsRequest,
  DeleteDraftCarriersRequest,
  DeleteDraftRecoveryFacilityDetailsRequest,
  DeleteDraftRequest,
  DraftCarriers,
  DraftCollectionDate,
  DraftCollectionDetail,
  DraftExporterDetail,
  DraftImporterDetail,
  DraftRecoveryFacilityDetails,
  DraftSubmissionConfirmation,
  DraftSubmissionDeclaration,
  DraftUkExitLocation,
  DraftWasteQuantityType,
  GetDraftCarriersRequest,
  GetDraftCollectionDateRequest,
  GetDraftCollectionDetailRequest,
  GetDraftCustomerReferenceRequest,
  GetDraftExporterDetailRequest,
  GetDraftImporterDetailRequest,
  GetDraftRecoveryFacilityDetailsRequest,
  GetDraftRequest,
  GetDraftSubmissionConfirmationRequest,
  GetDraftSubmissionDeclarationRequest,
  GetDraftTransitCountriesRequest,
  GetDraftUkExitLocationRequest,
  GetDraftWasteDescriptionRequest,
  GetDraftWasteQuantityRequest,
  ListDraftCarriersRequest,
  ListDraftRecoveryFacilityDetailsRequest,
} from './dto';
import {
  addressDetail,
  contactDetail,
  customerReference,
  errorResponseValue,
  recordState,
  ukAddressDetail,
  ukContactDetail,
} from '../common/schema';

export const draftWasteQuantityType: JTDSchemaType<DraftWasteQuantityType> = {
  enum: ['NotApplicable', 'EstimateData', 'ActualData'],
};

export const draftWasteDescription: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      optionalProperties: {
        wasteCode,
        ewcCodes: {
          elements: {
            ...ewcCode,
          },
        },
        description: { type: 'string' },
        nationalCode,
      },
    },
    Complete: {
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
    },
  },
};

export const draftWasteQuantity: SchemaObject = {
  discriminator: 'status',
  mapping: {
    CannotStart: {
      properties: {},
    },
    NotStarted: {
      properties: {},
    },
    Started: {
      optionalProperties: {
        value: {
          optionalProperties: {
            type: draftWasteQuantityType,
            estimateData: {
              optionalProperties: {
                quantityType: { enum: ['Volume', 'Weight'] },
                unit: {
                  enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
                },
                value: { type: 'float64' },
              },
            },
            actualData: {
              optionalProperties: {
                quantityType: { enum: ['Volume', 'Weight'] },
                unit: {
                  enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
                },
                value: { type: 'float64' },
              },
            },
          },
        },
      },
    },
    Complete: {
      properties: {
        value: {
          discriminator: 'type',
          mapping: {
            NotApplicable: { properties: {} },
            EstimateData: {
              properties: {
                estimateData: {
                  optionalProperties: {
                    quantityType: { enum: ['Volume', 'Weight'] },
                    unit: {
                      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
                    },
                    value: { type: 'float64' },
                  },
                },
                actualData: {
                  optionalProperties: {
                    quantityType: { enum: ['Volume', 'Weight'] },
                    unit: {
                      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
                    },
                    value: { type: 'float64' },
                  },
                },
              },
            },
            ActualData: {
              properties: {
                estimateData: {
                  optionalProperties: {
                    quantityType: { enum: ['Volume', 'Weight'] },
                    unit: {
                      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
                    },
                    value: { type: 'float64' },
                  },
                },
                actualData: {
                  optionalProperties: {
                    quantityType: { enum: ['Volume', 'Weight'] },
                    unit: {
                      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
                    },
                    value: { type: 'float64' },
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

export const draftExporterDetail: JTDSchemaType<DraftExporterDetail> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      optionalProperties: {
        exporterAddress: ukAddressDetail,
        exporterContactDetails: ukContactDetail,
      },
    },
    Complete: {
      properties: {
        exporterAddress: ukAddressDetail,
        exporterContactDetails: ukContactDetail,
      },
    },
  },
};

export const draftImporterDetail: JTDSchemaType<DraftImporterDetail> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      optionalProperties: {
        importerAddressDetails: addressDetail,
        importerContactDetails: contactDetail,
      },
    },
    Complete: {
      properties: {
        importerAddressDetails: addressDetail,
        importerContactDetails: contactDetail,
      },
    },
  },
};

export const draftCollectionDate: JTDSchemaType<DraftCollectionDate> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        value: {
          properties: {
            type: collectionDateType,
            estimateDate: {
              optionalProperties: {
                day: { type: 'string' },
                month: { type: 'string' },
                year: { type: 'string' },
              },
            },
            actualDate: {
              optionalProperties: {
                day: { type: 'string' },
                month: { type: 'string' },
                year: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const draftCarriers: JTDSchemaType<DraftCarriers> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {
        transport: { type: 'boolean' },
      },
    },
    Started: {
      properties: {
        transport: { type: 'boolean' },
        values: {
          elements: {
            properties: {
              id: { type: 'string' },
            },
            optionalProperties: {
              addressDetails: addressDetail,
              contactDetails: contactDetail,
              transportDetails: transportDetail,
            },
          },
        },
      },
    },
    Complete: {
      properties: {
        transport: { type: 'boolean' },
        values: {
          elements: {
            properties: {
              id: { type: 'string' },
              addressDetails: addressDetail,
              contactDetails: contactDetail,
            },
            optionalProperties: {
              transportDetails: transportDetail,
            },
          },
        },
      },
    },
  },
};

export const draftCollectionDetail: JTDSchemaType<DraftCollectionDetail> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        address: ukAddressDetail,
        contactDetails: ukContactDetail,
      },
    },
    Complete: {
      properties: {
        address: ukAddressDetail,
        contactDetails: ukContactDetail,
      },
    },
  },
};

export const draftUkExitLocation: JTDSchemaType<DraftUkExitLocation> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        exitLocation: {
          discriminator: 'provided',
          mapping: {
            Yes: { properties: { value: { type: 'string' } } },
            No: { properties: {} },
          },
        },
      },
    },
  },
};

export const draftTransitCountries: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {
        values: transitCountries,
      },
    },
    Complete: {
      properties: {
        values: transitCountries,
      },
    },
  },
};

export const draftRecoveryFacilityDetails: JTDSchemaType<DraftRecoveryFacilityDetails> =
  {
    discriminator: 'status',
    mapping: {
      CannotStart: {
        properties: {},
      },
      NotStarted: {
        properties: {},
      },
      Started: {
        properties: {
          values: {
            elements: {
              properties: {
                id: { type: 'string' },
              },
              optionalProperties: {
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
            },
          },
        },
      },
      Complete: {
        properties: {
          values: {
            elements: {
              properties: {
                id: { type: 'string' },
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
            },
          },
        },
      },
    },
  };

const draftSubmissionConfirmation: JTDSchemaType<DraftSubmissionConfirmation> =
  {
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
          confirmation: { type: 'boolean' },
        },
      },
    },
  };

const draftSubmissionDeclaration: JTDSchemaType<DraftSubmissionDeclaration> = {
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

const draftSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    reference: customerReference,
    wasteDescription: draftWasteDescription,
    wasteQuantity: draftWasteQuantity,
    exporterDetail: draftExporterDetail,
    importerDetail: draftImporterDetail,
    collectionDate: draftCollectionDate,
    carriers: draftCarriers,
    collectionDetail: draftCollectionDetail,
    ukExitLocation: draftUkExitLocation,
    transitCountries: draftTransitCountries,
    recoveryFacilityDetail: draftRecoveryFacilityDetails,
    submissionConfirmation: draftSubmissionConfirmation,
    submissionDeclaration: draftSubmissionDeclaration,
    submissionState: recordState,
  },
};

export const getDraftsResponse: SchemaObject = {
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
              wasteDescription: draftWasteDescription,
              collectionDate: draftCollectionDate,
              submissionDeclaration: draftSubmissionDeclaration,
              submissionState: recordState,
            },
          },
        },
      },
    },
  },
};

export const getDraftRequest: JTDSchemaType<GetDraftRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getDraftResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const createDraftRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    reference: customerReference,
  },
};

export const createDraftResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const deleteDraftRequest: JTDSchemaType<DeleteDraftRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const deleteDraftResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftCustomerReferenceRequest: JTDSchemaType<GetDraftCustomerReferenceRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftCustomerReferenceResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: customerReference,
  },
};

export const setDraftCustomerReferenceRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    reference: customerReference,
  },
};

export const setDraftCustomerReferenceResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftWasteDescriptionRequest: JTDSchemaType<GetDraftWasteDescriptionRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftWasteDescriptionResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftWasteDescription,
  },
};

export const setDraftWasteDescriptionRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftWasteDescription,
  },
};

export const setDraftWasteDescriptionResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftWasteQuantityRequest: JTDSchemaType<GetDraftWasteQuantityRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftWasteQuantityResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftWasteQuantity,
  },
};

export const setDraftWasteQuantityRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftWasteQuantity,
  },
};

export const setDraftWasteQuantityResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftExporterDetailRequest: JTDSchemaType<GetDraftExporterDetailRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftExporterDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftExporterDetail,
  },
};

export const setDraftExporterDetailRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftExporterDetail,
  },
};

export const setDraftExporterDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftImporterDetailRequest: JTDSchemaType<GetDraftImporterDetailRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftImporterDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftImporterDetail,
  },
};

export const setDraftImporterDetailRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftImporterDetail,
  },
};

export const setDraftImporterDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftCollectionDateRequest: JTDSchemaType<GetDraftCollectionDateRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftCollectionDateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftCollectionDate,
  },
};

export const setDraftCollectionDateRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftCollectionDate,
  },
};

export const setDraftCollectionDateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const listDraftCarriersRequest: JTDSchemaType<ListDraftCarriersRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const listDraftCarriersResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftCarriers,
  },
};

export const createDraftCarriersRequest: JTDSchemaType<CreateDraftCarriersRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      value: {
        properties: {
          status: { enum: ['NotStarted', 'Started', 'Complete'] },
        },
      },
    },
  };

export const createDraftCarriersResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftCarriers,
  },
};

export const getDraftCarriersRequest: JTDSchemaType<GetDraftCarriersRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    carrierId: { type: 'string' },
  },
};

export const getDraftCarriersResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftCarriers,
  },
};

export const setDraftCarriersRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    carrierId: { type: 'string' },
    value: draftCarriers,
  },
};

export const setDraftCarriersResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const deleteDraftCarriersRequest: JTDSchemaType<DeleteDraftCarriersRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      carrierId: { type: 'string' },
    },
  };

export const deleteDraftCarriersResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftCollectionDetailRequest: JTDSchemaType<GetDraftCollectionDetailRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftCollectionDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftCollectionDetail,
  },
};

export const setDraftCollectionDetailRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftCollectionDetail,
  },
};

export const setDraftCollectionDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftUkExitLocationRequest: JTDSchemaType<GetDraftUkExitLocationRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftUkExitLocationResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftUkExitLocation,
  },
};

export const setDraftUkExitLocationRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftUkExitLocation,
  },
};

export const setDraftUkExitLocationResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftTransitCountriesRequest: JTDSchemaType<GetDraftTransitCountriesRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftTransitCountriesResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftTransitCountries,
  },
};

export const setDraftTransitCountriesRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftTransitCountries,
  },
};

export const setDraftTransitCountriesResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const listDraftRecoveryFacilityDetailsRequest: JTDSchemaType<ListDraftRecoveryFacilityDetailsRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const listDraftRecoveryFacilityDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftRecoveryFacilityDetails,
  },
};

export const createDraftRecoveryFacilityDetailsRequest: JTDSchemaType<CreateDraftRecoveryFacilityDetailsRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      value: {
        properties: {
          status: {
            enum: ['CannotStart', 'NotStarted', 'Started', 'Complete'],
          },
        },
      },
    },
  };

export const createDraftRecoveryFacilityDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftRecoveryFacilityDetails,
  },
};

export const getDraftRecoveryFacilityDetailsRequest: JTDSchemaType<GetDraftRecoveryFacilityDetailsRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      rfdId: { type: 'string' },
    },
  };

export const getDraftRecoveryFacilityDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftRecoveryFacilityDetails,
  },
};

export const setDraftRecoveryFacilityDetailsRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    rfdId: { type: 'string' },
    value: draftRecoveryFacilityDetails,
  },
};

export const setDraftRecoveryFacilityDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const deleteDraftRecoveryFacilityDetailsRequest: JTDSchemaType<DeleteDraftRecoveryFacilityDetailsRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      rfdId: { type: 'string' },
    },
  };

export const deleteDraftRecoveryFacilityDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftSubmissionConfirmationRequest: JTDSchemaType<GetDraftSubmissionConfirmationRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftSubmissionConfirmationResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmissionConfirmation,
  },
};

export const setDraftSubmissionConfirmationRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftSubmissionConfirmation,
  },
};

export const setDraftSubmissionConfirmationResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftSubmissionDeclarationRequest: JTDSchemaType<GetDraftSubmissionDeclarationRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftSubmissionDeclarationResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmissionDeclaration,
  },
};

export const setDraftSubmissionDeclarationRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: {
      properties: {
        status: {
          enum: ['CannotStart', 'NotStarted', 'Complete'],
        },
      },
    },
  },
};

export const setDraftSubmissionDeclarationResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};
