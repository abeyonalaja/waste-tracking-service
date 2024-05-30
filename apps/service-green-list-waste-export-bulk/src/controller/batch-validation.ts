import {
  AddContentToBatchRequest,
  schema,
} from '@wts/api/green-list-waste-export-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const addContentToBatchRequest = ajv.compile<AddContentToBatchRequest>(
  schema.addContentToBatchRequest,
);
