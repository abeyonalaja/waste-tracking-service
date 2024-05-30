import {
  CreateSubmissionRequest,
  PutReferenceRequest,
  PutWasteDescriptionRequest,
  PutExporterDetailRequest,
  PutImporterDetailRequest,
  CreateCarriersRequest,
  SetCarriersRequest,
  SetCollectionDetailRequest,
  PutExitLocationRequest,
  PutTransitCountriesRequest,
  CreateRecoveryFacilityDetailRequest,
  SetRecoveryFacilityDetailRequest,
  PutSubmissionConfirmationRequest,
  PutSubmissionDeclarationRequest,
  PutSubmissionCancellationRequest,
  WasteQuantity,
  WasteQuantityData,
  CollectionDateData,
  CollectionDate,
} from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreateSubmissionRequest =
  ajv.compile<CreateSubmissionRequest>({
    properties: {
      reference: { type: 'string' },
    },
  });

export const validatePutReferenceRequest = ajv.compile<PutReferenceRequest>({
  type: 'string',
});

export const validatePutWasteDescriptionRequest =
  ajv.compile<PutWasteDescriptionRequest>({
    definitions: {
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
      nationalCode: {
        discriminator: 'provided',
        mapping: {
          Yes: { properties: { value: { type: 'string' } } },
          No: { properties: {} },
        },
      },
      description: { type: 'string' },
    },
    discriminator: 'status',
    mapping: {
      NotStarted: {
        properties: {},
      },
      Started: {
        properties: {},
        optionalProperties: {
          wasteCode: { ref: 'wasteCode' },
          nationalCode: { ref: 'nationalCode' },
          ewcCodes: { ref: 'ewcCodes' },
          description: { ref: 'description' },
        },
      },
      Complete: {
        properties: {
          wasteCode: { ref: 'wasteCode' },
          ewcCodes: { ref: 'ewcCodes' },
          description: { ref: 'description' },
        },
        optionalProperties: {
          nationalCode: { ref: 'nationalCode' },
        },
      },
    },
  });

export const validatePutDraftWasteQuantityRequest = ajv.compile<WasteQuantity>({
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
});

export const validatePutSubmissionWasteQuantityRequest =
  ajv.compile<WasteQuantityData>({
    discriminator: 'type',
    mapping: {
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
  });

export const validatePutExporterDetailRequest =
  ajv.compile<PutExporterDetailRequest>({
    definitions: {
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
    discriminator: 'status',
    mapping: {
      NotStarted: {
        properties: {},
      },
      Started: {
        properties: {},
        optionalProperties: {
          exporterAddress: { ref: 'exporterAddress' },
          exporterContactDetails: { ref: 'exporterContactDetails' },
        },
      },
      Complete: {
        properties: {
          exporterAddress: { ref: 'exporterAddress' },
          exporterContactDetails: { ref: 'exporterContactDetails' },
        },
      },
    },
  });

export const validatePutImporterDetailRequest =
  ajv.compile<PutImporterDetailRequest>({
    definitions: {
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
    discriminator: 'status',
    mapping: {
      NotStarted: {
        properties: {},
      },
      Started: {
        properties: {},
        optionalProperties: {
          importerAddressDetails: { ref: 'importerAddressDetails' },
          importerContactDetails: { ref: 'importerContactDetails' },
        },
      },
      Complete: {
        properties: {
          importerAddressDetails: { ref: 'importerAddressDetails' },
          importerContactDetails: { ref: 'importerContactDetails' },
        },
      },
    },
  });

export const validatePutDraftCollectionDateRequest =
  ajv.compile<CollectionDate>({
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
              actualDate: {
                optionalProperties: {
                  day: { type: 'string' },
                  month: { type: 'string' },
                  year: { type: 'string' },
                },
              },
              estimateDate: {
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
  });

export const validatePutSubmissionCollectionDateRequest =
  ajv.compile<CollectionDateData>({
    properties: {
      type: { enum: ['EstimateDate', 'ActualDate'] },
      actualDate: {
        optionalProperties: {
          day: { type: 'string' },
          month: { type: 'string' },
          year: { type: 'string' },
        },
      },
      estimateDate: {
        optionalProperties: {
          day: { type: 'string' },
          month: { type: 'string' },
          year: { type: 'string' },
        },
      },
    },
  });

export const validateCreateCarriersRequest = ajv.compile<CreateCarriersRequest>(
  {
    properties: { status: { type: 'string' } },
  },
);

export const validateSetCarriersRequest = ajv.compile<SetCarriersRequest>({
  definitions: {
    transport: { type: 'boolean' },
    id: { type: 'string' },
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
        Road: {
          optionalProperties: {
            description: { type: 'string' },
          },
        },
        Sea: {
          optionalProperties: {
            description: { type: 'string' },
          },
        },
        Air: {
          optionalProperties: {
            description: { type: 'string' },
          },
        },
        Rail: {
          optionalProperties: {
            description: { type: 'string' },
          },
        },
        InlandWaterways: {
          optionalProperties: {
            description: { type: 'string' },
          },
        },
      },
    },
  },
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {
        transport: { ref: 'transport' },
      },
    },
    Started: {
      properties: {
        transport: { ref: 'transport' },
        values: {
          elements: {
            properties: {
              id: { ref: 'id' },
            },
            optionalProperties: {
              addressDetails: { ref: 'addressDetails' },
              contactDetails: { ref: 'contactDetails' },
              transportDetails: { ref: 'transportDetails' },
            },
          },
        },
      },
    },
    Complete: {
      properties: {
        transport: { ref: 'transport' },
        values: {
          elements: {
            properties: {
              id: { ref: 'id' },
            },
            optionalProperties: {
              addressDetails: { ref: 'addressDetails' },
              contactDetails: { ref: 'contactDetails' },
              transportDetails: { ref: 'transportDetails' },
            },
          },
        },
      },
    },
  },
});

export const validateSetCollectionDetailRequest =
  ajv.compile<SetCollectionDetailRequest>({
    definitions: {
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
    },
    discriminator: 'status',
    mapping: {
      NotStarted: {
        properties: {},
      },
      Started: {
        properties: {},
        optionalProperties: {
          address: { ref: 'address' },
          contactDetails: { ref: 'contactDetails' },
        },
      },
      Complete: {
        properties: {
          address: { ref: 'address' },
          contactDetails: { ref: 'contactDetails' },
        },
      },
    },
  });

export const validatePutExitLocationRequest =
  ajv.compile<PutExitLocationRequest>({
    definitions: {
      exitLocation: {
        discriminator: 'provided',
        mapping: {
          Yes: { properties: { value: { type: 'string' } } },
          No: { properties: {} },
        },
      },
    },
    discriminator: 'status',
    mapping: {
      NotStarted: {
        properties: {},
      },
      Complete: {
        properties: {
          exitLocation: { ref: 'exitLocation' },
        },
      },
    },
  });

export const validatePutTransitCountriesRequest =
  ajv.compile<PutTransitCountriesRequest>({
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
  });

export const validateCreateRecoveryFacilityDetailRequest =
  ajv.compile<CreateRecoveryFacilityDetailRequest>({
    properties: { status: { type: 'string' } },
  });

export const validateSetRecoveryFacilityDetailRequest =
  ajv.compile<SetRecoveryFacilityDetailRequest>({
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
          },
        },
      },
    },
  });

export const validatePutSubmissionConfirmationRequest =
  ajv.compile<PutSubmissionConfirmationRequest>({
    definitions: {
      submissionConfirmation: {
        properties: {
          confirmation: { type: 'boolean' },
        },
      },
    },
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
  });

export const validatePutSubmissionDeclarationRequest =
  ajv.compile<PutSubmissionDeclarationRequest>({
    discriminator: 'status',
    mapping: {
      CannotStart: {
        properties: {},
      },
      NotStarted: {
        properties: {},
      },
      Complete: {
        properties: {},
      },
    },
  });

export const validatePutSubmissionCancellationRequest =
  ajv.compile<PutSubmissionCancellationRequest>({
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
  });
