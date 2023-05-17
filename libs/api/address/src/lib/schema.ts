import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import { Address, GetAddressByPostcodeRequest } from './address';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const getAddressByPostcodeRequest: JTDSchemaType<GetAddressByPostcodeRequest> =
  {
    properties: {
      postcode: { type: 'string' },
    },
  };

const addressResponse: JTDSchemaType<Address> = {
  properties: {
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    townCity: { type: 'string' },
    postcode: { type: 'string' },
    country: { type: 'string' },
  },
};

export const getAddressByPostcodeResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { elements: addressResponse },
  },
};
