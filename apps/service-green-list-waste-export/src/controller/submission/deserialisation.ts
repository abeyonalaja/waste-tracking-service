import { submission as api, common } from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getSubmissionsRequest =
  ajv.compileParser<common.GetRecordsRequest>(common.schema.getRecordsRequest);

export const getSubmissionRequest = ajv.compileParser<api.GetSubmissionRequest>(
  api.schema.getSubmissionRequest,
);

export const getWasteQuantityRequest =
  ajv.compileParser<api.GetWasteQuantityRequest>(
    api.schema.getWasteQuantityRequest,
  );

export const getCollectionDateRequest =
  ajv.compileParser<api.GetCollectionDateRequest>(
    api.schema.getCollectionDateRequest,
  );

export const getNumberOfSubmissionsRequest =
  ajv.compileParser<api.GetNumberOfSubmissionsRequest>(
    api.schema.getNumberOfSubmissionsRequest,
  );

export const getBulkSubmissionsRequest =
  ajv.compileParser<api.GetBulkSubmissionsRequest>(
    api.schema.getBulkSubmissionsRequest,
  );
