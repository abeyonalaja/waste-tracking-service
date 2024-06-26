import {
  AddContentToBatchRequest,
  GetBatchRequest,
  FinalizeBatchRequest,
  schema,
  DownloadBatchRequest,
  GetRowRequest,
  GetColumnRequest,
  GetBulkSubmissionsRequest,
} from '@wts/api/uk-waste-movements-bulk';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const addContentToBatchRequest = ajv.compile<AddContentToBatchRequest>(
  schema.addContentToBatchRequest,
);

export const getBatchRequest = ajv.compileParser<GetBatchRequest>(
  schema.getBatchRequest,
);

export const finalizeBatchRequest = ajv.compileParser<FinalizeBatchRequest>(
  schema.finalizeBatchRequest,
);

export const downloadCsvRequest = ajv.compile<DownloadBatchRequest>(
  schema.downloadCsvRequest,
);

export const getRowRequest = ajv.compile<GetRowRequest>(schema.getRowRequest);

export const getColumnRequest = ajv.compile<GetColumnRequest>(
  schema.getColumnRequest,
);

export const getBulkSubmissionsRequest = ajv.compile<GetBulkSubmissionsRequest>(
  schema.getBulkSubmissionsRequest,
);
