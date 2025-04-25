import {
  CancelPaymentRequest,
  GetPaymentRequest,
  SetPaymentRequest,
  schema,
} from '@wts/api/payment';
import Ajv from 'ajv/dist/jtd.js';

const ajv = new Ajv();

export const setPaymentRequest = ajv.compileParser<SetPaymentRequest>(
  schema.setPaymentRequest,
);

export const getPaymentRequest = ajv.compileParser<GetPaymentRequest>(
  schema.getPaymentRequest,
);

export const cancelPaymentRequest = ajv.compileParser<CancelPaymentRequest>(
  schema.cancelPaymentRequest,
);
