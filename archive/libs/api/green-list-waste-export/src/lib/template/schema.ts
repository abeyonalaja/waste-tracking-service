import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  CreateTemplateFromTemplateRequest,
  CreateTemplateRequest,
  DeleteTemplateRequest,
  TemplateDetail,
  TemplateDetailRequestValue,
  UpdateTemplateRequest,
} from './dto';
import {
  draftCarriers,
  draftCollectionDetail,
  draftExporterDetail,
  draftImporterDetail,
  draftRecoveryFacilityDetails,
  draftTransitCountries,
  draftUkExitLocation,
  draftWasteDescription,
} from '../draft/schema';
import { customerReference, errorResponseValue } from '../common/schema';

const templateDetail: JTDSchemaType<TemplateDetail> = {
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    created: { type: 'timestamp' },
    lastModified: { type: 'timestamp' },
  },
};

const template: SchemaObject = {
  properties: {
    id: { type: 'string' },
    templateDetails: templateDetail,
    wasteDescription: draftWasteDescription,
    exporterDetail: draftExporterDetail,
    importerDetail: draftImporterDetail,
    carriers: draftCarriers,
    collectionDetail: draftCollectionDetail,
    ukExitLocation: draftUkExitLocation,
    transitCountries: draftTransitCountries,
    recoveryFacilityDetail: draftRecoveryFacilityDetails,
  },
};

export const templateDetailRequestValue: JTDSchemaType<TemplateDetailRequestValue> =
  {
    properties: {
      name: templateDetail.properties.name,
      description: templateDetail.properties.description,
    },
  };

export const getTemplatesRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    order: { enum: ['ASC', 'DESC'] },
  },
  optionalProperties: {
    pageLimit: { type: 'uint16' },
    token: { type: 'string' },
  },
};

export const getTemplatesResponse: SchemaObject = {
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
              templateDetails: templateDetail,
            },
          },
        },
      },
    },
  },
};

export const getNumberOfTemplatesRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
  },
};

export const getNumberOfTemplatesResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { type: 'uint16' },
  },
};

export const getTemplateRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
  },
};

export const getTemplateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: template,
  },
};

export const createTemplateRequest: JTDSchemaType<CreateTemplateRequest> = {
  properties: {
    accountId: { type: 'string' },
    templateDetails: templateDetailRequestValue,
  },
};

export const createTemplateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: template,
  },
};

export const createTemplateFromSubmissionRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    templateDetails: templateDetailRequestValue,
  },
};

export const createTemplateFromTemplateRequest: JTDSchemaType<CreateTemplateFromTemplateRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      templateDetails: templateDetailRequestValue,
    },
  };

export const updateTemplateRequest: JTDSchemaType<UpdateTemplateRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    templateDetails: templateDetailRequestValue,
  },
};

export const deleteTemplateRequest: JTDSchemaType<DeleteTemplateRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const createDraftFromTemplateRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    reference: customerReference,
  },
};
