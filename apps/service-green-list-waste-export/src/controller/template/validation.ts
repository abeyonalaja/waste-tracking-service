import { template as api } from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const createTemplateRequest = ajv.compile<api.CreateTemplateRequest>(
  api.schema.createTemplateRequest,
);

export const createTemplateFromTemplateRequest =
  ajv.compile<api.CreateTemplateFromTemplateRequest>(
    api.schema.createTemplateFromTemplateRequest,
  );

export const updateTemplateRequest = ajv.compile<api.UpdateTemplateRequest>(
  api.schema.updateTemplateRequest,
);

export const createDraftFromTemplateRequest =
  ajv.compile<api.CreateDraftFromTemplateRequest>(
    api.schema.createDraftFromTemplateRequest,
  );

export const createTemplateFromSubmissionRequest =
  ajv.compile<api.CreateTemplateFromSubmissionRequest>(
    api.schema.createTemplateFromSubmissionRequest,
  );
