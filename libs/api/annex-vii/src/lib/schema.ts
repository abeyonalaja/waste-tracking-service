import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  CreateDraftRequest,
  CustomerReference,
  GetDraftByIdRequest,
  GetDraftCustomerReferenceByIdRequest,
  GetDraftExporterDetailByIdRequest,
  GetDraftImporterDetailByIdRequest,
  GetDraftCollectionDateByIdRequest,
  GetDraftWasteDescriptionByIdRequest,
  GetDraftWasteQuantityByIdRequest,
  GetDraftsRequest,
  ListDraftCarriersRequest,
  CreateDraftCarriersRequest,
  DeleteDraftCarriersRequest,
  GetDraftCarriersRequest,
  GetDraftExitLocationByIdRequest,
} from './dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const customerReference: JTDSchemaType<CustomerReference> = {
  type: 'string',
  nullable: true,
};

const draftWasteDescriptionData = {
  wasteCode: {
    discriminator: 'type',
    mapping: {
      NotApplicable: { properties: {} },
      BaselAnnexIX: { properties: { value: { type: 'string' } } },
      Oecd: { properties: { value: { type: 'string' } } },
      AnnexIIIA: { properties: { value: { type: 'string' } } },
      AnnexIIIB: { properties: { value: { type: 'string' } } },
    },
  },
  ewcCodes: { elements: { type: 'string' } },
  nationalCode: {
    discriminator: 'provided',
    mapping: {
      Yes: { properties: { value: { type: 'string' } } },
      No: { properties: {} },
    },
  },
  description: { type: 'string' },
};

const draftWasteDescription: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        wasteCode: draftWasteDescriptionData.wasteCode,
        nationalCode: draftWasteDescriptionData.nationalCode,
        ewcCodes: draftWasteDescriptionData.ewcCodes,
        description: draftWasteDescriptionData.description,
      },
    },
    Complete: {
      properties: {
        wasteCode: draftWasteDescriptionData.wasteCode,
        nationalCode: draftWasteDescriptionData.nationalCode,
        ewcCodes: draftWasteDescriptionData.ewcCodes,
        description: draftWasteDescriptionData.description,
      },
    },
  },
};

const draftWasteQuantity: SchemaObject = {
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
            quantityType: { enum: ['Volume', 'Weight'] },
            value: { type: 'float64' },
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
                quantityType: { enum: ['Volume', 'Weight'] },
                value: { type: 'float64' },
              },
            },
            ActualData: {
              properties: {
                quantityType: { enum: ['Volume', 'Weight'] },
                value: { type: 'float64' },
              },
            },
          },
        },
      },
    },
  },
};

const draftExporterDetailData = {
  exporterAddress: {
    properties: {
      addressLine1: { type: 'string' },
      townCity: { type: 'string' },
      postcode: { type: 'string' },
      country: { type: 'string' },
    },
    optionalProperties: {
      addressLine2: { type: 'string' },
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
};

const draftExporterDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        exporterAddress: draftExporterDetailData.exporterAddress,
        exporterContactDetails: draftExporterDetailData.exporterContactDetails,
      },
    },
    Complete: {
      properties: {
        exporterAddress: draftExporterDetailData.exporterAddress,
        exporterContactDetails: draftExporterDetailData.exporterContactDetails,
      },
    },
  },
};

const draftImporterDetailData = {
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
};

const draftImporterDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        importerAddressDetails: draftImporterDetailData.importerAddressDetails,
        importerContactDetails: draftImporterDetailData.importerContactDetails,
      },
    },
    Complete: {
      properties: {
        importerAddressDetails: draftImporterDetailData.importerAddressDetails,
        importerContactDetails: draftImporterDetailData.importerContactDetails,
      },
    },
  },
};

const draftCollectionDate: SchemaObject = {
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
            day: { type: 'string' },
            month: { type: 'string' },
            year: { type: 'string' },
          },
        },
      },
    },
  },
};

const draftCarriers: SchemaObject = {
  discriminator: 'status',
  mapping: {
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
              transportDetails: {
                discriminator: 'type',
                mapping: {
                  ShippingContainer: {
                    properties: {
                      shippingContainerNumber: { type: 'string' },
                    },
                    optionalProperties: {
                      vehicleRegistration: { type: 'string' },
                    },
                  },
                  Trailer: {
                    properties: {
                      vehicleRegistration: { type: 'string' },
                    },
                    optionalProperties: {
                      trailerNumber: { type: 'string' },
                    },
                  },
                  BulkVessel: {
                    properties: {
                      imo: { type: 'string' },
                    },
                  },
                },
              },
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
            },
            optionalProperties: {
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
              transportDetails: {
                discriminator: 'type',
                mapping: {
                  ShippingContainer: {
                    properties: {
                      shippingContainerNumber: { type: 'string' },
                    },
                    optionalProperties: {
                      vehicleRegistration: { type: 'string' },
                    },
                  },
                  Trailer: {
                    properties: {
                      vehicleRegistration: { type: 'string' },
                    },
                    optionalProperties: {
                      trailerNumber: { type: 'string' },
                    },
                  },
                  BulkVessel: {
                    properties: {
                      imo: { type: 'string' },
                    },
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

const notStartedSection: SchemaObject = {
  properties: {
    status: {
      enum: ['NotStarted'],
    },
  },
};

const recoveryFacilityDetail: SchemaObject = {
  properties: {
    status: {
      enum: ['CannotStart', 'NotStarted'],
    },
  },
};

const draftExitLocation: SchemaObject = {
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
    collectionDetail: notStartedSection,
    ukExitLocation: draftExitLocation,
    transitCountries: notStartedSection,
    recoveryFacilityDetail: recoveryFacilityDetail,
  },
};

export const getDraftsRequest: JTDSchemaType<GetDraftsRequest> = {
  properties: { accountId: { type: 'string' } },
};

export const getDraftsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        properties: {
          id: { type: 'string' },
          reference: customerReference,
          wasteDescription: { ref: 'sectionSummary' },
          wasteQuantity: { ref: 'sectionSummary' },
          exporterDetail: { ref: 'sectionSummary' },
          importerDetail: { ref: 'sectionSummary' },
          collectionDate: { ref: 'sectionSummary' },
          carriers: { ref: 'sectionSummary' },
          collectionDetail: { ref: 'sectionSummary' },
          ukExitLocation: { ref: 'sectionSummary' },
          transitCountries: { ref: 'sectionSummary' },
          recoveryFacilityDetail: { ref: 'sectionSummary' },
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
    value: customerReference,
  },
};

export const setDraftCustomerReferenceByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftWasteDescriptionByIdRequest: JTDSchemaType<GetDraftWasteDescriptionByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftWasteDescriptionByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const setDraftWasteDescriptionByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftWasteDescription,
  },
};

export const setDraftWasteDescriptionByIdResponse: SchemaObject = {
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

export const getDraftExporterDetailByIdRequest: JTDSchemaType<GetDraftExporterDetailByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftExporterDetailByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftExporterDetail,
  },
};

export const setDraftExporterDetailByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftExporterDetail,
  },
};

export const setDraftExporterDetailByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getDraftImporterDetailByIdRequest: JTDSchemaType<GetDraftImporterDetailByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftImporterDetailByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftImporterDetail,
  },
};

export const setDraftImporterDetailByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftImporterDetail,
  },
};

export const setDraftImporterDetailByIdResponse: SchemaObject = {
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

export const getDraftExitLocationByIdRequest: JTDSchemaType<GetDraftExitLocationByIdRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
    },
  };

export const getDraftExitLocationByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftExitLocation,
  },
};

export const setDraftExitLocationByIdRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: draftExitLocation,
  },
};

export const setDraftExitLocationByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};
