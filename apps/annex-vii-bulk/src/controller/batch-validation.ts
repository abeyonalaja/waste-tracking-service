import { AddBatchContentRequest, schema } from '@wts/api/annex-vii-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const addBatchContentRequest = ajv.compile<AddBatchContentRequest>(
  schema.addBatchContentRequest
);
