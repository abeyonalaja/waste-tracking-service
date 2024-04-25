import {
  ValidateSubmissionsRequest,
  submissionSchema,
  CreateSubmissionsRequest,
} from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateSubmissionsRequest =
  ajv.compile<ValidateSubmissionsRequest>(
    submissionSchema.validateSubmissionsRequest
  );

export const validatePartialSubmissionsRequest =
  ajv.compile<CreateSubmissionsRequest>(
    submissionSchema.createSubmissionsRequest
  );
