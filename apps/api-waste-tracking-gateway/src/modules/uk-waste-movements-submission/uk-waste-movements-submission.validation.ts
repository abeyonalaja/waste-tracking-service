import {
  UkwmCreateDraftRequest,
  UkwmAddress,
  UkwmContact,
  UkwmSetDraftWasteSourceRequest,
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

export const validateSetDraftProducerContactRequest = ajv.compile<UkwmContact>({
  properties: {
    organisationName: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
  },
  optionalProperties: {
    fax: { type: 'string' },
  },
});

export const validateSetPartialDraftProducerContactRequest = ajv.compile<
  Partial<UkwmContact>
>({
  properties: {},
  optionalProperties: {
    organisationName: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    fax: { type: 'string' },
  },
});

export const validateSetDraftWasteSource =
  ajv.compile<UkwmSetDraftWasteSourceRequest>({
    properties: { wasteSource: { type: 'string' } },
  });
