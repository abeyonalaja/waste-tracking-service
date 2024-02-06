import { AddContentToBatchRequest, schema } from '@wts/api/annex-vii-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const addContentToBatchRequest = ajv.compile<AddContentToBatchRequest>(
  schema.addContentToBatchRequest
);
