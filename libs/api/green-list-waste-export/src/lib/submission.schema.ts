import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  CreateDraftRequest,
  DeleteDraftRequest,
  CancelDraftByIdRequest,
  CustomerReference,
  GetDraftByIdRequest,
  GetDraftCustomerReferenceByIdRequest,
  GetDraftCollectionDateByIdRequest,
  GetDraftWasteQuantityByIdRequest,
  GetDraftsRequest,
  GetDraftSubmissionConfirmationByIdRequest,
  GetDraftSubmissionDeclarationByIdRequest,
  DraftSubmissionCancellationType,
} from './submission.dto';
import {
  draftCarriers,
  draftCollectionDetail,
  draftExitLocation,
  draftExporterDetail,
  draftImporterDetail,
  draftRecoveryFacilityDetails,
  draftTransitCountries,
  draftWasteDescription,
  errorResponseValue,
} from './submissionBase.schema';

const customerReference: JTDSchemaType<CustomerReference> = {
  type: 'string',
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
      properties: {},
      optionalProperties: {
        value: {
          properties: {},
          optionalProperties: {
            type: { enum: ['NotApplicable', 'EstimateData', 'ActualData'] },
            estimateData: {
              optionalProperties: {
                quantityType: { enum: ['Volume', 'Weight'] },
                unit: { enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'] },
                value: { type: 'float64' },
              },
            },
            actualData: {
              optionalProperties: {
                quantityType: { enum: ['Volume', 'Weight'] },
                unit: { enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'] },
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

export const draftCollectionDate: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        value: {
          properties: {
            type: { enum: ['EstimateDate', 'ActualDate'] },
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

const draftSubmissionConfirmation: SchemaObject = {
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

const draftSubmissionDeclaration: SchemaObject = {
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
            declarationTimestamp: { type: 'string' },
            transactionId: { type: 'string' },
          },
        },
      },
    },
  },
};

const draftSubmissionCancellationType: JTDSchemaType<DraftSubmissionCancellationType> =
  {
    discriminator: 'type',
    mapping: {
      ChangeOfRecoveryFacilityOrLaboratory: {
        properties: {},
      },
      NoLongerExportingWaste: {
        properties: {},
      },
      Other: {
        properties: {
          reason: { type: 'string' },
        },
      },
    },
  };

const draftSubmissionState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    InProgress: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    Cancelled: {
      properties: {
        timestamp: { type: 'timestamp' },
        cancellationType: draftSubmissionCancellationType,
      },
    },
    Deleted: {
      properties: {
        timestamp: { type: 'timestamp' },
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
    ukExitLocation: draftExitLocation,
    transitCountries: draftTransitCountries,
    recoveryFacilityDetail: draftRecoveryFacilityDetails,
    submissionConfirmation: draftSubmissionConfirmation,
    submissionDeclaration: draftSubmissionDeclaration,
    submissionState: draftSubmissionState,
  },
};

export const getDraftsRequest: JTDSchemaType<GetDraftsRequest> = {
  properties: {
    accountId: { type: 'string' },
    order: { enum: ['ASC', 'DESC'] },
  },
  optionalProperties: {
    pageLimit: { type: 'float64' },
    state: {
      elements: {
        enum: [
          'InProgress',
          'Cancelled',
          'Deleted',
          'SubmittedWithEstimates',
          'SubmittedWithActuals',
          'UpdatedWithActuals',
        ],
      },
    },
    token: { type: 'string' },
  },
};

export const getDraftsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        totalSubmissions: { type: 'float64' },
        totalPages: { type: 'float64' },
        currentPage: { type: 'float64' },
        pages: {
          elements: {
            properties: {
              pageNumber: { type: 'float64' },
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
              wasteQuantity: { ref: 'sectionSummary' },
              exporterDetail: { ref: 'sectionSummary' },
              importerDetail: { ref: 'sectionSummary' },
              collectionDate: draftCollectionDate,
              carriers: { ref: 'sectionSummary' },
              collectionDetail: { ref: 'sectionSummary' },
              ukExitLocation: { ref: 'sectionSummary' },
              transitCountries: { ref: 'sectionSummary' },
              recoveryFacilityDetail: { ref: 'sectionSummary' },
              submissionConfirmation: { ref: 'sectionSummary' },
              submissionDeclaration: draftSubmissionDeclaration,
              submissionState: draftSubmissionState,
            },
          },
        },
      },
    },
  },
  definitions: {
    sectionSummary: {
      properties: {
        status: { enum: ['CannotStart', 'NotStarted', 'Started', 'Complete'] },
      },
    },
  },
};

export const getDraftByIdRequest: JTDSchemaType<GetDraftByIdRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getDraftByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const createDraftRequest: JTDSchemaType<CreateDraftRequest> = {
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

export const cancelDraftByIdRequest: JTDSchemaType<CancelDraftByIdRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    cancellationType: draftSubmissionCancellationType,
  },
};

export const cancelDraftByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftCustomerReferenceByIdRequest: JTDSchemaType<GetDraftCustomerReferenceByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftCustomerReferenceByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: customerReference,
  },
};

export const setDraftCustomerReferenceByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    reference: customerReference,
  },
};

export const setDraftCustomerReferenceByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftWasteQuantityByIdRequest: JTDSchemaType<GetDraftWasteQuantityByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftWasteQuantityByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftWasteQuantity,
  },
};

export const setDraftWasteQuantityByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftWasteQuantity,
  },
};

export const setDraftWasteQuantityByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftCollectionDateByIdRequest: JTDSchemaType<GetDraftCollectionDateByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftCollectionDateByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftCollectionDate,
  },
};

export const setDraftCollectionDateByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftCollectionDate,
  },
};

export const setDraftCollectionDateByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftSubmissionConfirmationByIdByIdRequest: JTDSchemaType<GetDraftSubmissionConfirmationByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftSubmissionConfirmationByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmissionConfirmation,
  },
};

export const setDraftSubmissionConfirmationByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftSubmissionConfirmation,
  },
};

export const setDraftSubmissionConfirmationByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftSubmissionDeclarationByIdByIdRequest: JTDSchemaType<GetDraftSubmissionDeclarationByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftSubmissionDeclarationByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmissionDeclaration,
  },
};

export const setDraftSubmissionDeclarationByIdRequest: SchemaObject = {
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

export const setDraftSubmissionDeclarationByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const createDraftFromTemplateRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    reference: customerReference,
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
        complete: { type: 'float64' },
        incomplete: { type: 'float64' },
        completeWithEstimates: { type: 'float64' },
      },
    },
  },
};

export const wasteDescription: SchemaObject = {
  properties: {
    wasteCode: {
      discriminator: 'type',
      mapping: {
        NotApplicable: { properties: {} },
        BaselAnnexIX: { properties: { code: { type: 'string' } } },
        OECD: { properties: { code: { type: 'string' } } },
        AnnexIIIA: { properties: { code: { type: 'string' } } },
        AnnexIIIB: { properties: { code: { type: 'string' } } },
      },
    },
    ewcCodes: {
      elements: {
        properties: {
          code: {
            type: 'string',
          },
        },
      },
    },
    description: { type: 'string' },
  },
  optionalProperties: {
    nationalCode: {
      discriminator: 'provided',
      mapping: {
        Yes: { properties: { value: { type: 'string' } } },
        No: { properties: {} },
      },
    },
  },
};

export const wasteQuantity: SchemaObject = {
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
};

export const exporterDetail: SchemaObject = {
  properties: {
    exporterAddress: {
      properties: {
        addressLine1: { type: 'string' },
        townCity: { type: 'string' },
        country: { type: 'string' },
      },
      optionalProperties: {
        addressLine2: { type: 'string' },
        postcode: { type: 'string' },
      },
    },
    exporterContactDetails: {
      properties: {
        organisationName: { type: 'string' },
        fullName: { type: 'string' },
        emailAddress: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
      optionalProperties: {
        faxNumber: { type: 'string' },
      },
    },
  },
};

export const importerDetail: SchemaObject = {
  properties: {
    importerAddressDetails: {
      properties: {
        organisationName: { type: 'string' },
        address: { type: 'string' },
        country: { type: 'string' },
      },
    },
    importerContactDetails: {
      properties: {
        fullName: { type: 'string' },
        emailAddress: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
      optionalProperties: {
        faxNumber: { type: 'string' },
      },
    },
  },
};

export const collectionDate: SchemaObject = {
  properties: {
    type: { enum: ['EstimateDate', 'ActualDate'] },
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
};

export const carriers: SchemaObject = {
  elements: {
    properties: {
      addressDetails: {
        properties: {
          organisationName: { type: 'string' },
          address: { type: 'string' },
          country: { type: 'string' },
        },
      },
      contactDetails: {
        properties: {
          fullName: { type: 'string' },
          emailAddress: { type: 'string' },
          phoneNumber: { type: 'string' },
        },
        optionalProperties: {
          faxNumber: { type: 'string' },
        },
      },
    },
    optionalProperties: {
      transportDetails: {
        properties: {
          type: { enum: ['Road', 'Air', 'Sea', 'Rail', 'InlandWaterways'] },
        },
        optionalProperties: {
          description: { type: 'string' },
        },
      },
    },
  },
};

export const collectionDetail: SchemaObject = {
  properties: {
    address: {
      properties: {
        addressLine1: { type: 'string' },
        townCity: { type: 'string' },
        country: { type: 'string' },
      },
      optionalProperties: {
        addressLine2: { type: 'string' },
        postcode: { type: 'string' },
      },
    },
    contactDetails: {
      properties: {
        organisationName: { type: 'string' },
        fullName: { type: 'string' },
        emailAddress: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
      optionalProperties: {
        faxNumber: { type: 'string' },
      },
    },
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

export const recoveryFacilityDetail: SchemaObject = {
  elements: {
    properties: {
      addressDetails: {
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          country: { type: 'string' },
        },
      },
      contactDetails: {
        properties: {
          fullName: { type: 'string' },
          emailAddress: { type: 'string' },
          phoneNumber: { type: 'string' },
        },
        optionalProperties: {
          faxNumber: { type: 'string' },
        },
      },
      recoveryFacilityType: {
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
      },
    },
  },
};

export const validateSubmissionsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    values: {
      elements: {
        properties: {
          reference: { type: 'string' },
          baselAnnexIXCode: { type: 'string' },
          oecdCode: { type: 'string' },
          annexIIIACode: { type: 'string' },
          annexIIIBCode: { type: 'string' },
          laboratory: { type: 'string' },
          ewcCodes: { type: 'string' },
          nationalCode: { type: 'string' },
          wasteDescription: { type: 'string' },
          wasteQuantityTonnes: { type: 'string' },
          wasteQuantityCubicMetres: { type: 'string' },
          wasteQuantityKilograms: { type: 'string' },
          estimatedOrActualWasteQuantity: { type: 'string' },
          exporterOrganisationName: { type: 'string' },
          exporterAddressLine1: { type: 'string' },
          exporterAddressLine2: { type: 'string' },
          exporterTownOrCity: { type: 'string' },
          exporterCountry: { type: 'string' },
          exporterPostcode: { type: 'string' },
          exporterContactFullName: { type: 'string' },
          exporterContactPhoneNumber: { type: 'string' },
          exporterFaxNumber: { type: 'string' },
          exporterEmailAddress: { type: 'string' },
          importerOrganisationName: { type: 'string' },
          importerAddress: { type: 'string' },
          importerCountry: { type: 'string' },
          importerContactFullName: { type: 'string' },
          importerContactPhoneNumber: { type: 'string' },
          importerFaxNumber: { type: 'string' },
          importerEmailAddress: { type: 'string' },
          wasteCollectionDate: { type: 'string' },
          estimatedOrActualCollectionDate: { type: 'string' },
          firstCarrierOrganisationName: { type: 'string' },
          firstCarrierAddress: { type: 'string' },
          firstCarrierCountry: { type: 'string' },
          firstCarrierContactFullName: { type: 'string' },
          firstCarrierContactPhoneNumber: { type: 'string' },
          firstCarrierFaxNumber: { type: 'string' },
          firstCarrierEmailAddress: { type: 'string' },
          firstCarrierMeansOfTransport: { type: 'string' },
          firstCarrierMeansOfTransportDetails: { type: 'string' },
          secondCarrierOrganisationName: { type: 'string' },
          secondCarrierAddress: { type: 'string' },
          secondCarrierCountry: { type: 'string' },
          secondCarrierContactFullName: { type: 'string' },
          secondCarrierContactPhoneNumber: { type: 'string' },
          secondCarrierFaxNumber: { type: 'string' },
          secondCarrierEmailAddress: { type: 'string' },
          secondCarrierMeansOfTransport: { type: 'string' },
          secondCarrierMeansOfTransportDetails: { type: 'string' },
          thirdCarrierOrganisationName: { type: 'string' },
          thirdCarrierAddress: { type: 'string' },
          thirdCarrierCountry: { type: 'string' },
          thirdCarrierContactFullName: { type: 'string' },
          thirdCarrierContactPhoneNumber: { type: 'string' },
          thirdCarrierFaxNumber: { type: 'string' },
          thirdCarrierEmailAddress: { type: 'string' },
          thirdCarrierMeansOfTransport: { type: 'string' },
          thirdCarrierMeansOfTransportDetails: { type: 'string' },
          fourthCarrierOrganisationName: { type: 'string' },
          fourthCarrierAddress: { type: 'string' },
          fourthCarrierCountry: { type: 'string' },
          fourthCarrierContactFullName: { type: 'string' },
          fourthCarrierContactPhoneNumber: { type: 'string' },
          fourthCarrierFaxNumber: { type: 'string' },
          fourthCarrierEmailAddress: { type: 'string' },
          fourthCarrierMeansOfTransport: { type: 'string' },
          fourthCarrierMeansOfTransportDetails: { type: 'string' },
          fifthCarrierOrganisationName: { type: 'string' },
          fifthCarrierAddress: { type: 'string' },
          fifthCarrierCountry: { type: 'string' },
          fifthCarrierContactFullName: { type: 'string' },
          fifthCarrierContactPhoneNumber: { type: 'string' },
          fifthCarrierFaxNumber: { type: 'string' },
          fifthCarrierEmailAddress: { type: 'string' },
          fifthCarrierMeansOfTransport: { type: 'string' },
          fifthCarrierMeansOfTransportDetails: { type: 'string' },
          wasteCollectionOrganisationName: { type: 'string' },
          wasteCollectionAddressLine1: { type: 'string' },
          wasteCollectionAddressLine2: { type: 'string' },
          wasteCollectionTownOrCity: { type: 'string' },
          wasteCollectionCountry: { type: 'string' },
          wasteCollectionPostcode: { type: 'string' },
          wasteCollectionContactFullName: { type: 'string' },
          wasteCollectionContactPhoneNumber: { type: 'string' },
          wasteCollectionFaxNumber: { type: 'string' },
          wasteCollectionEmailAddress: { type: 'string' },
          whereWasteLeavesUk: { type: 'string' },
          transitCountries: { type: 'string' },
          interimSiteOrganisationName: { type: 'string' },
          interimSiteAddress: { type: 'string' },
          interimSiteCountry: { type: 'string' },
          interimSiteContactFullName: { type: 'string' },
          interimSiteContactPhoneNumber: { type: 'string' },
          interimSiteFaxNumber: { type: 'string' },
          interimSiteEmailAddress: { type: 'string' },
          interimSiteRecoveryCode: { type: 'string' },
          laboratoryOrganisationName: { type: 'string' },
          laboratoryAddress: { type: 'string' },
          laboratoryCountry: { type: 'string' },
          laboratoryContactFullName: { type: 'string' },
          laboratoryContactPhoneNumber: { type: 'string' },
          laboratoryFaxNumber: { type: 'string' },
          laboratoryEmailAddress: { type: 'string' },
          laboratoryDisposalCode: { type: 'string' },
          firstRecoveryFacilityOrganisationName: { type: 'string' },
          firstRecoveryFacilityAddress: { type: 'string' },
          firstRecoveryFacilityCountry: { type: 'string' },
          firstRecoveryFacilityContactFullName: { type: 'string' },
          firstRecoveryFacilityContactPhoneNumber: { type: 'string' },
          firstRecoveryFacilityFaxNumber: { type: 'string' },
          firstRecoveryFacilityEmailAddress: { type: 'string' },
          firstRecoveryFacilityRecoveryCode: { type: 'string' },
          secondRecoveryFacilityOrganisationName: { type: 'string' },
          secondRecoveryFacilityAddress: { type: 'string' },
          secondRecoveryFacilityCountry: { type: 'string' },
          secondRecoveryFacilityContactFullName: { type: 'string' },
          secondRecoveryFacilityContactPhoneNumber: { type: 'string' },
          secondRecoveryFacilityFaxNumber: { type: 'string' },
          secondRecoveryFacilityEmailAddress: { type: 'string' },
          secondRecoveryFacilityRecoveryCode: { type: 'string' },
          thirdRecoveryFacilityOrganisationName: { type: 'string' },
          thirdRecoveryFacilityAddress: { type: 'string' },
          thirdRecoveryFacilityCountry: { type: 'string' },
          thirdRecoveryFacilityContactFullName: { type: 'string' },
          thirdRecoveryFacilityContactPhoneNumber: { type: 'string' },
          thirdRecoveryFacilityFaxNumber: { type: 'string' },
          thirdRecoveryFacilityEmailAddress: { type: 'string' },
          thirdRecoveryFacilityRecoveryCode: { type: 'string' },
          fourthRecoveryFacilityOrganisationName: { type: 'string' },
          fourthRecoveryFacilityAddress: { type: 'string' },
          fourthRecoveryFacilityCountry: { type: 'string' },
          fourthRecoveryFacilityContactFullName: { type: 'string' },
          fourthRecoveryFacilityContactPhoneNumber: { type: 'string' },
          fourthRecoveryFacilityFaxNumber: { type: 'string' },
          fourthRecoveryFacilityEmailAddress: { type: 'string' },
          fourthRecoveryFacilityRecoveryCode: { type: 'string' },
          fifthRecoveryFacilityOrganisationName: { type: 'string' },
          fifthRecoveryFacilityAddress: { type: 'string' },
          fifthRecoveryFacilityCountry: { type: 'string' },
          fifthRecoveryFacilityContactFullName: { type: 'string' },
          fifthRecoveryFacilityContactPhoneNumber: { type: 'string' },
          fifthRecoveryFacilityFaxNumber: { type: 'string' },
          fifthRecoveryFacilityEmailAddress: { type: 'string' },
          fifthRecoveryFacilityRecoveryCode: { type: 'string' },
        },
      },
    },
  },
};

const validationResult: SchemaObject = {
  properties: {
    valid: { type: 'boolean' },
    accountId: { type: 'string' },
    values: {
      elements: {
        optionalProperties: {
          reference: { type: 'string' },
          wasteDescription: wasteDescription,
          wasteQuantity: wasteQuantity,
          exporterDetail: exporterDetail,
          importerDetail: importerDetail,
          collectionDate: collectionDate,
          carriers: carriers,
          collectionDetail: collectionDetail,
          ukExitLocation: ukExitLocation,
          transitCountries: transitCountries,
          recoveryFacilityDetail: recoveryFacilityDetail,
          index: { type: 'uint16' },
          fieldFormatErrors: {
            elements: {
              properties: {
                field: {
                  enum: [
                    'CustomerReference',
                    'WasteDescription',
                    'WasteQuantity',
                    'ExporterDetail',
                    'ImporterDetail',
                    'CollectionDate',
                    'Carriers',
                    'CollectionDetail',
                    'UkExitLocation',
                    'TransitCountries',
                    'RecoveryFacilityDetail',
                  ],
                },
                message: { type: 'string' },
              },
            },
          },
          invalidStructureErrors: {
            elements: {
              properties: {
                fields: {
                  elements: {
                    properties: {
                      field: {
                        enum: [
                          'CustomerReference',
                          'WasteDescription',
                          'WasteQuantity',
                          'ExporterDetail',
                          'ImporterDetail',
                          'CollectionDate',
                          'Carriers',
                          'CollectionDetail',
                          'UkExitLocation',
                          'TransitCountries',
                          'RecoveryFacilityDetail',
                        ],
                      },
                      message: { type: 'string' },
                    },
                  },
                },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const validateSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: validationResult,
  },
};
