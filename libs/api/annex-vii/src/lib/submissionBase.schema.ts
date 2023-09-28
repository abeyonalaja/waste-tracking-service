import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  GetDraftExporterDetailByIdRequest,
  GetDraftImporterDetailByIdRequest,
  GetDraftWasteDescriptionByIdRequest,
  ListDraftCarriersRequest,
  CreateDraftCarriersRequest,
  DeleteDraftCarriersRequest,
  GetDraftCarriersRequest,
  ListDraftRecoveryFacilityDetailsRequest,
  CreateDraftRecoveryFacilityDetailsRequest,
  DeleteDraftRecoveryFacilityDetailsRequest,
  GetDraftRecoveryFacilityDetailsRequest,
  GetDraftExitLocationByIdRequest,
  GetDraftTransitCountriesRequest,
  GetDraftCollectionDetailRequest,
} from './submissionBase.dto';

export const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
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
  ewcCodes: {
    elements: {
      properties: {
        code: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  },
  nationalCode: {
    discriminator: 'provided',
    mapping: {
      Yes: { properties: { value: { type: 'string' } } },
      No: { properties: {} },
    },
  },
  description: { type: 'string' },
};

export const draftWasteDescription: SchemaObject = {
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

const draftExporterDetailData = {
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
};

export const draftExporterDetail: SchemaObject = {
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

export const draftImporterDetail: SchemaObject = {
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

export const draftCarriers: SchemaObject = {
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
        transport: { type: 'boolean' },
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

const draftCollectionDetailData = {
  address: {
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
};

export const draftCollectionDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      properties: {},
      optionalProperties: {
        address: draftCollectionDetailData.address,
        contactDetails: draftCollectionDetailData.contactDetails,
      },
    },
    Complete: {
      properties: {
        address: draftCollectionDetailData.address,
        contactDetails: draftCollectionDetailData.contactDetails,
      },
    },
  },
};

export const draftRecoveryFacilityDetails: SchemaObject = {
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
            },
          },
        },
      },
    },
  },
};

export const draftExitLocation: SchemaObject = {
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
        values: { elements: { type: 'string' } },
      },
    },
    Complete: {
      properties: {
        values: { elements: { type: 'string' } },
      },
    },
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
    value: draftWasteDescription,
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
