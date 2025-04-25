import { template as api } from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getTemplatesRequest = ajv.compileParser<api.GetTemplatesRequest>(
  api.schema.getTemplatesRequest,
);

export const getTemplateRequest = ajv.compileParser<api.GetTemplateRequest>(
  api.schema.getTemplateRequest,
);

export const deleteTemplateRequest =
  ajv.compileParser<api.DeleteTemplateRequest>(
    api.schema.deleteTemplateRequest,
  );

export const getNumberOfTemplatesRequest =
  ajv.compileParser<api.GetNumberOfTemplatesRequest>(
    api.schema.getNumberOfTemplatesRequest,
  );
