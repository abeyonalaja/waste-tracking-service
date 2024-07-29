import { UkwmCreateDraftRequest } from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreateDraftRequest = ajv.compile<UkwmCreateDraftRequest>({
  properties: {
    reference: { type: 'string' },
  },
});
