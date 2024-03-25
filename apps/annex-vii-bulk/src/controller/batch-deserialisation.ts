import {
  GetBatchRequest,
  UpdateBatchRequest,
  schema,
} from '@wts/api/green-list-waste-export-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getBatchRequest = ajv.compileParser<GetBatchRequest>(
  schema.getBatchRequest
);

export const updateBatchRequest = ajv.compileParser<UpdateBatchRequest>(
  schema.updateBatchRequest
);
