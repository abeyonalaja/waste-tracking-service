import {
  GetDraftRequest,
  draftSchema,
  CreateMultipleDraftsRequest,
  ValidateMultipleDraftsRequest,
  CreateDraftRequest,
  SetDraftProducerAddressDetailsRequest,
  GetDraftProducerAddressDetailsRequest,
  SetDraftProducerContactDetailRequest,
  SetDraftWasteSourceRequest,
  GetDraftProducerContactDetailRequest,
  GetDraftWasteSourceRequest,
  GetDraftWasteCollectionAddressDetailsRequest,
  SetDraftWasteCollectionAddressDetailsRequest,
  CreateDraftSicCodeRequest,
  GetDraftSicCodesRequest,
  GetDraftCarrierAddressDetailsRequest,
  SetDraftCarrierAddressDetailsRequest,
  GetDraftReceiverAddressDetailsRequest,
  SetDraftReceiverAddressDetailsRequest,
  DeleteDraftSicCodeRequest,
  SetDraftProducerConfirmationRequest,
  SetDraftReceiverContactDetailsRequest,
  GetDraftReceiverContactDetailsRequest,
  GetDraftReceiverContactDetailsResponse,
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

export const validateGetDraftContactDetailRequest =
  ajv.compile<GetDraftProducerContactDetailRequest>(
    draftSchema.getDraftProducerContactDetailRequest,
  );

export const validateSetDraftProducerContactDetailRequest =
  ajv.compile<SetDraftProducerContactDetailRequest>(
    draftSchema.setDraftProducerContactDetailRequest,
  );

export const validateSetPartialDraftProducerContactDetailRequest =
  ajv.compile<SetDraftProducerContactDetailRequest>(
    draftSchema.setPartialDraftProducerContactDetailRequest,
  );

export const validateSetDraftWasteSourceRequest =
  ajv.compile<SetDraftWasteSourceRequest>(
    draftSchema.setDraftWasteSourceRequest,
  );

export const validateGetDraftWasteSourceRequest =
  ajv.compile<GetDraftWasteSourceRequest>(
    draftSchema.getDraftWasteSourceRequest,
  );

export const validateSetDraftWasteCollectionAddressDetailsRequest =
  ajv.compile<SetDraftWasteCollectionAddressDetailsRequest>(
    draftSchema.setDraftWasteCollectionAddressDetailsRequest,
  );

export const validateSetPartialDraftWasteCollectionAddressDetailsRequest =
  ajv.compile<SetDraftWasteCollectionAddressDetailsRequest>(
    draftSchema.setPartialDraftWasteCollectionAddressDetailsRequest,
  );

export const validateGetDraftWasteCollectionAddressDetailsRequest =
  ajv.compile<GetDraftWasteCollectionAddressDetailsRequest>(
    draftSchema.getDraftWasteCollectionAddressDetailsRequest,
  );

export const validateCreateDraftSicCodeRequest =
  ajv.compile<CreateDraftSicCodeRequest>(draftSchema.createDraftSicCodeRequest);

export const validateGetDraftSicCodesRequest =
  ajv.compile<GetDraftSicCodesRequest>(draftSchema.getDraftSicCodesRequest);

export const validateSetDraftCarrierAddressDetailsRequest =
  ajv.compile<SetDraftCarrierAddressDetailsRequest>(
    draftSchema.setDraftCarrierAddressDetailsRequest,
  );

export const validateSetPartialDraftCarrierAddressDetailsRequest =
  ajv.compile<SetDraftCarrierAddressDetailsRequest>(
    draftSchema.setPartialDraftCarrierAddressDetailsRequest,
  );

export const validateGetDraftCarrierAddressDetailsRequest =
  ajv.compile<GetDraftCarrierAddressDetailsRequest>(
    draftSchema.getDraftCarrierAddressDetailsRequest,
  );

export const validateSetDraftReceiverAddressDetailsRequest =
  ajv.compile<SetDraftReceiverAddressDetailsRequest>(
    draftSchema.setDraftReceiverAddressDetailsRequest,
  );

export const validateSetPartialDraftReceiverAddressDetailsRequest =
  ajv.compile<SetDraftReceiverAddressDetailsRequest>(
    draftSchema.setPartialDraftReceiverAddressDetailsRequest,
  );

export const validateGetDraftReceiverAddressDetailsRequest =
  ajv.compile<GetDraftReceiverAddressDetailsRequest>(
    draftSchema.getDraftReceiverAddressDetailsRequest,
  );
export const validateDeleteDraftSicCodeRequest =
  ajv.compile<DeleteDraftSicCodeRequest>(draftSchema.deleteDraftSicCodeRequest);

export const setDraftProducerConfirmationRequest =
  ajv.compile<SetDraftProducerConfirmationRequest>(
    draftSchema.setDraftProducerConfirmationRequest,
  );

export const validateSetDraftReceiverContactDetailRequest =
  ajv.compile<SetDraftReceiverContactDetailsRequest>(
    draftSchema.setDraftReceiverContactDetailRequest,
  );

export const validateSetPartialDraftReceiverContactDetailRequest =
  ajv.compile<SetDraftReceiverContactDetailsRequest>(
    draftSchema.setPartialDraftReceiverContactDetailRequest,
  );

export const validateGetDraftReceiverContactDetailRequest =
  ajv.compile<GetDraftReceiverContactDetailsRequest>(
    draftSchema.getDraftReceiverContactDetailRequest,
  );

export const validateGetDraftReceiverContactDetailResponse =
  ajv.compile<GetDraftReceiverContactDetailsResponse>(
    draftSchema.getDraftReceiverContactDetailResponse,
  );
