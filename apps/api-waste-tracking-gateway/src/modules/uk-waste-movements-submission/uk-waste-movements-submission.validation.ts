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

export const validateSetDraftWasteSourceRequest =
  ajv.compile<UkwmSetDraftWasteSourceRequest>({
    properties: { wasteSource: { type: 'string' } },
  });

export const validateSetDraftWasteCollectionAddressDetailsRequest =
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

export const validateSetPartialDraftWasteCollectionAddressDetailsRequest =
  ajv.compile<Partial<UkwmAddress>>({
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

export const validateSetDraftCarrierAddressDetailsRequest =
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

export const validateSetPartialDraftCarrierAddressDetailsRequest = ajv.compile<
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

export const validateSetDraftReceiverAddressDetailsRequest =
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

export const validateSetPartialDraftReceiverAddressDetailsRequest = ajv.compile<
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
export const validateSetDraftReceiverContactRequest = ajv.compile<UkwmContact>({
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

export const validateSetPartialDraftReceiverContactRequest = ajv.compile<
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
