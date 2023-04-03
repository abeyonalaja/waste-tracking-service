import {
  CreateSubmissionRequest,
  PutReferenceRequest,
  PutWasteDescriptionRequest,
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
      ecaCodes: { elements: { type: 'string' } },
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
          ecaCodes: { ref: 'ecaCodes' },
          description: { ref: 'description' },
        },
      },
      Complete: {
        properties: {
          wasteCode: { ref: 'wasteCode' },
          nationalCode: { ref: 'nationalCode' },
          ecaCodes: { ref: 'ecaCodes' },
          description: { ref: 'description' },
        },
      },
    },
  });
