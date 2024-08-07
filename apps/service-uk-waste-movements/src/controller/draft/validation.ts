import {
  GetDraftRequest,
  draftSchema,
  CreateMultipleDraftsRequest,
  ValidateMultipleDraftsRequest,
  CreateDraftRequest,
  SetDraftProducerAddressDetailsRequest,
  GetDraftProducerAddressDetailsRequest,
} from '@wts/api/uk-waste-movements';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateMultipleDraftsRequest =
  ajv.compile<ValidateMultipleDraftsRequest>(
    draftSchema.validateMultipleDraftsRequest,
  );

export const validateCreateMultipleDraftsRequest =
  ajv.compile<CreateMultipleDraftsRequest>(
    draftSchema.createMultipleDraftsRequest,
  );

export const validateGetDraftsRequest = ajv.compile<GetDraftRequest>(
  draftSchema.getDraftsRequest,
);

export const validateCreateDraftsRequest = ajv.compile<CreateDraftRequest>(
  draftSchema.createDraftRequest,
);

export const validateSetDraftProducerAddressDetailsRequest =
  ajv.compile<SetDraftProducerAddressDetailsRequest>(
    draftSchema.setDraftProducerAddressDetailsRequest,
  );

export const validateSetPartialDraftProducerAddressDetailsRequest =
  ajv.compile<SetDraftProducerAddressDetailsRequest>(
    draftSchema.setPartialDraftProducerAddressDetailsRequest,
  );

export const validateGetDraftProducerAddressDetailsRequest =
  ajv.compile<GetDraftProducerAddressDetailsRequest>(
    draftSchema.getDraftProducerAddressDetailsRequest,
  );
