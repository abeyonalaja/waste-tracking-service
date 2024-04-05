import {
  ValidateSubmissionsRequest,
  submissionSchema,
} from '@wts/api/uk-waste-movements';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateSubmissionsRequest =
  ajv.compile<ValidateSubmissionsRequest>(
    submissionSchema.validateSubmissionsRequest
  );
