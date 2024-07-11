import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  CreatePaymentRequest,
  GetPaymentRequest,
  Link,
  CreatedPayment,
  SetPaymentRequest,
} from './payment';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const link: JTDSchemaType<Link> = {
  properties: {
    href: { type: 'string' },
    method: { enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
  },
};

export const createdPayment: JTDSchemaType<CreatedPayment> = {
  properties: {
    id: { type: 'string' },
    amount: { type: 'uint16' },
    description: { type: 'string' },
    reference: { type: 'string' },
    paymentId: { type: 'string' },
    createdDate: { type: 'string' },
    returnUrl: { type: 'string' },
    redirectUrl: link,
    cancelUrl: link,
  },
};

export const createPaymentRequest: JTDSchemaType<CreatePaymentRequest> = {
  properties: {
    accountId: { type: 'string' },
    returnUrl: { type: 'string' },
  },
  optionalProperties: {
    description: { type: 'string' },
    amount: { type: 'uint16' },
  },
};

export const createPaymentResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: createdPayment,
  },
};

export const paymentState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    InProgress: {
      properties: {},
    },
    Success: {
      properties: {
        capturedDate: { type: 'string' },
      },
    },
    Rejected: {
      properties: {
        code: { enum: ['P0010', 'P0020', 'P0030', 'P0040', 'P0050'] },
      },
    },
    SessionExpired: {
      properties: {
        code: { enum: ['P0010', 'P0020', 'P0030', 'P0040', 'P0050'] },
      },
    },
    CancelledByUser: {
      properties: {
        code: { enum: ['P0010', 'P0020', 'P0030', 'P0040', 'P0050'] },
      },
    },
    CancelledByService: {
      properties: {
        code: { enum: ['P0010', 'P0020', 'P0030', 'P0040', 'P0050'] },
      },
    },
    Error: {
      properties: {
        code: { enum: ['P0010', 'P0020', 'P0030', 'P0040', 'P0050'] },
      },
    },
  },
};

export const paymentRecord: SchemaObject = {
  properties: {
    id: { type: 'string' },
    amount: { type: 'uint16' },
    description: { type: 'string' },
    reference: { type: 'string' },
    paymentId: { type: 'string' },
    state: paymentState,
  },
  optionalProperties: {
    expiryDate: { type: 'string' },
  },
};

export const setPaymentRequest: JTDSchemaType<SetPaymentRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const setPaymentResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: paymentRecord,
  },
};

export const paymentReference: SchemaObject = {
  properties: {
    serviceChargePaid: { type: 'boolean' },
    expiryDate: { type: 'string' },
    renewalDate: { type: 'string' },
  },
};

export const getPaymentRequest: JTDSchemaType<GetPaymentRequest> = {
  properties: {
    accountId: { type: 'string' },
  },
};

export const getPaymentResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: paymentReference,
  },
};
