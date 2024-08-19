import {
  UkwmCreateDraftRequest,
  UkwmAddress,
  UkwmContact,
  UkwmSetDraftWasteSourceRequest,
  UkwmCreateDraftSicCodeRequest,
  UkwmSetDraftProducerConfirmationRequest,
} from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreateDraftRequest = ajv.compile<UkwmCreateDraftRequest>({
  properties: {
    reference: { type: 'string' },
  },
});

export const validateSetDraftProducerAddressRequest = ajv.compile<UkwmAddress>({
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

export const validateSetPartialDraftProducerAddressRequest = ajv.compile<
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

export const validateSetDraftWasteCollectionAddressRequest =
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

export const validateSetPartialDraftWasteCollectionAddressRequest = ajv.compile<
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

export const validateCreateDraftSicCodeRequest =
  ajv.compile<UkwmCreateDraftSicCodeRequest>({
    properties: { sicCode: { type: 'string' } },
  });

export const validateSetDraftCarrierAddressRequest = ajv.compile<UkwmAddress>({
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

export const validateSetPartialDraftCarrierAddressRequest = ajv.compile<
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

export const validateSetDraftReceiverAddressRequest = ajv.compile<UkwmAddress>({
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

export const validateSetPartialDraftReceiverAddressRequest = ajv.compile<
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

export const validateSetDraftProducerConfirmationRequest =
  ajv.compile<UkwmSetDraftProducerConfirmationRequest>({
    properties: {
      isConfirmed: { type: 'boolean' },
    },
  });
