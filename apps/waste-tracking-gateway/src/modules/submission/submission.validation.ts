import {
  CreateSubmissionRequest,
  PutReferenceRequest,
  PutWasteDescriptionRequest,
  PutWasteQuantityRequest,
  PutExporterDetailRequest,
  PutImporterDetailRequest,
} from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreateSubmissionRequest =
  ajv.compile<CreateSubmissionRequest>({
    optionalProperties: {
      reference: { type: 'string' },
    },
  });

export const validatePutReferenceRequest = ajv.compile<PutReferenceRequest>({
  type: 'string',
  nullable: true,
});

export const validatePutWasteDescriptionRequest =
  ajv.compile<PutWasteDescriptionRequest>({
    definitions: {
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
          nationalCode: { ref: 'nationalCode' },
          ewcCodes: { ref: 'ewcCodes' },
          description: { ref: 'description' },
        },
      },
    },
  });

export const validatePutWasteQuantityRequest =
  ajv.compile<PutWasteQuantityRequest>({
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
  });

export const validatePutExporterDetailRequest =
  ajv.compile<PutExporterDetailRequest>({
    definitions: {
      exporterAddress: {
        properties: {
          addressLine1: { type: 'string' },
          addressLine2: { type: 'string' },
          townCity: { type: 'string' },
          postcode: { type: 'string' },
          country: { type: 'string' },
        },
      },
      exporterContactDetails: {
        properties: {
          organisationName: { type: 'string' },
          fullName: { type: 'string' },
          emailAddress: { type: 'string' },
          phoneNumber: { type: 'string' },
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
      importerContactDetails: {
        properties: {
          organisationName: { type: 'string' },
          address: { type: 'string' },
          country: { type: 'string' },
          fullName: { type: 'string' },
          emailAddress: { type: 'string' },
          phoneNumber: { type: 'string' },
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
          importerContactDetails: { ref: 'importerContactDetails' },
        },
      },
      Complete: {
        properties: {
          importerContactDetails: { ref: 'importerContactDetails' },
        },
      },
    },
  });
