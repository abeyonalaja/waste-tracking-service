import {
  UkwmCreateDraftRequest,
  UkwmAddress,
} from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreateDraftRequest = ajv.compile<UkwmCreateDraftRequest>({
  properties: {
    reference: { type: 'string' },
  },
});

export const validateSetDraftProducerAddressDetailsRequest =
  ajv.compile<UkwmAddress>({
    properties: {
      addressLine1: { type: 'string' },
      townCity: { type: 'string' },
      country: { type: 'string' },
    },
    optionalProperties: {
      buildingNameOrNumber: { type: 'string' },
      addressLine2: { type: 'string' },
      postcode: { type: 'string' },
    },
  });

export const validateSetPartialDraftProducerAddressDetailsRequest = ajv.compile<
  Partial<UkwmAddress>
>({
  properties: {},
  optionalProperties: {
    buildingNameOrNumber: { type: 'string' },
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
    postcode: { type: 'string' },
  },
});
