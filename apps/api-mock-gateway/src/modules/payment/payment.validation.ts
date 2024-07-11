import { CreatePaymentRequest } from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreatePaymentRequest = ajv.compile<CreatePaymentRequest>({
  properties: {
    returnUrl: { type: 'string' },
  },
  optionalProperties: {
    description: { type: 'string' },
    amount: { type: 'uint16' },
  },
});
