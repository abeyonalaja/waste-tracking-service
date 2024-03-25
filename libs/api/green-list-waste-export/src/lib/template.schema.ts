import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  draftWasteDescription,
  draftExporterDetail,
  draftImporterDetail,
  draftCarriers,
  draftCollectionDetail,
  draftExitLocation,
  draftTransitCountries,
  draftRecoveryFacilityDetails,
  errorResponseValue,
} from './submissionBase.schema';
import {
  CreateTemplateFromSubmissionRequest,
  CreateTemplateFromTemplateRequest,
  CreateTemplateRequest,
  DeleteTemplateRequest,
  TemplateDetails,
  UpdateTemplateRequest,
} from './template.dto';

const templateDetails: JTDSchemaType<TemplateDetails> = {
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
    templateDetails: templateDetails,
    wasteDescription: draftWasteDescription,
    exporterDetail: draftExporterDetail,
    importerDetail: draftImporterDetail,
    carriers: draftCarriers,
    collectionDetail: draftCollectionDetail,
    ukExitLocation: draftExitLocation,
    transitCountries: draftTransitCountries,
    recoveryFacilityDetail: draftRecoveryFacilityDetails,
  },
};

export const getTemplatesRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    order: { enum: ['ASC', 'DESC'] },
  },
  optionalProperties: {
    pageLimit: { type: 'float64' },
    token: { type: 'string' },
  },
};

export const getTemplatesResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        totalTemplates: { type: 'float64' },
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
              templateDetails: templateDetails,
              wasteDescription: { ref: 'sectionSummary' },
              exporterDetail: { ref: 'sectionSummary' },
              importerDetail: { ref: 'sectionSummary' },
              carriers: { ref: 'sectionSummary' },
              collectionDetail: { ref: 'sectionSummary' },
              ukExitLocation: { ref: 'sectionSummary' },
              transitCountries: { ref: 'sectionSummary' },
              recoveryFacilityDetail: { ref: 'sectionSummary' },
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

export const getNumberOfTemplatesRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
  },
};

export const getNumberOfTemplatesResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { type: 'float64' },
  },
};

export const getTemplateByIdRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
  },
};

export const getTemplateByIdResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: template,
  },
};

export const createTemplateRequest: JTDSchemaType<CreateTemplateRequest> = {
  properties: {
    accountId: { type: 'string' },
    templateDetails: {
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  },
};

export const createTemplateResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: template,
  },
};

export const createTemplateFromSubmissionRequest: JTDSchemaType<CreateTemplateFromSubmissionRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      templateDetails: {
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  };

export const createTemplateFromTemplateRequest: JTDSchemaType<CreateTemplateFromTemplateRequest> =
  {
    properties: {
      id: { type: 'string' },
      accountId: { type: 'string' },
      templateDetails: {
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  };

export const updateTemplateRequest: JTDSchemaType<UpdateTemplateRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    templateDetails: {
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  },
};

export const deleteTemplateRequest: JTDSchemaType<DeleteTemplateRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};
