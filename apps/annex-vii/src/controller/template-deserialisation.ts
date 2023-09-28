import {
  CreateTemplateRequest,
  CreateTemplateFromSubmissionRequest,
  CreateTemplateFromTemplateRequest,
  DeleteTemplateRequest,
  GetTemplateByIdRequest,
  GetTemplatesRequest,
  templateSchema,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getTemplatesRequest = ajv.compileParser<GetTemplatesRequest>(
  templateSchema.getTemplatesRequest
);

export const getTemplateByIdRequest = ajv.compileParser<GetTemplateByIdRequest>(
  templateSchema.getTemplateByIdRequest
);

export const createTemplate = ajv.compileParser<CreateTemplateRequest>(
  templateSchema.createTemplateRequest
);

export const createTemplateFromSubmission =
  ajv.compileParser<CreateTemplateFromSubmissionRequest>(
    templateSchema.createTemplateFromSubmissionRequest
  );

export const createTemplateFromTemplate =
  ajv.compileParser<CreateTemplateFromTemplateRequest>(
    templateSchema.createTemplateFromTemplateRequest
  );

export const deleteTemplateRequest = ajv.compileParser<DeleteTemplateRequest>(
  templateSchema.deleteTemplateRequest
);
