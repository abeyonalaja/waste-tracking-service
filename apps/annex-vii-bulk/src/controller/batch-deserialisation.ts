import { GetBatchContentRequest, schema } from '@wts/api/annex-vii-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getBatchContentRequest = ajv.compileParser<GetBatchContentRequest>(
  schema.getBatchContentRequest
);
