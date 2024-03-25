import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import { PingRequest } from './dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const pingRequest: JTDSchemaType<PingRequest> = {
  properties: {
    message: { type: 'string' },
  },
};

export const pingResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
