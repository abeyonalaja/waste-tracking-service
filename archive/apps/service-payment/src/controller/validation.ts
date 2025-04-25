import { CreatePaymentRequest, schema } from '@wts/api/payment';
import Ajv from 'ajv/dist/jtd.js';

const ajv = new Ajv();

export const createPaymentRequest = ajv.compile<CreatePaymentRequest>(
  schema.createPaymentRequest,
);
