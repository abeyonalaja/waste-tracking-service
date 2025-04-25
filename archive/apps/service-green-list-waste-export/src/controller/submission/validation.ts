import { submission as api } from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const setWasteQuantityRequest = ajv.compile<api.SetWasteQuantityRequest>(
  api.schema.setWasteQuantityRequest,
);

export const setCollectionDateRequest =
  ajv.compile<api.SetCollectionDateRequest>(
    api.schema.setCollectionDateRequest,
  );

export const cancelSubmissionRequest = ajv.compile<api.CancelSubmissionRequest>(
  api.schema.cancelSubmissionRequest,
);

export const validateSubmissionsRequest =
  ajv.compile<api.ValidateSubmissionsRequest>(
    api.schemaFlattened.validateSubmissionsRequest,
  );

export const validateCreateSubmissionsRequest =
  ajv.compile<api.CreateSubmissionsRequest>(
    api.schema.createSubmissionsRequest,
  );
