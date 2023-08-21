import {
  CreateDraftRequest,
  DeleteDraftRequest,
  CancelDraftByIdRequest,
  GetDraftByIdRequest,
  GetDraftCustomerReferenceByIdRequest,
  GetDraftExporterDetailByIdRequest,
  GetDraftImporterDetailByIdRequest,
  GetDraftWasteDescriptionByIdRequest,
  GetDraftWasteQuantityByIdRequest,
  GetDraftCollectionDateByIdRequest,
  GetDraftsRequest,
  GetDraftCarriersRequest,
  ListDraftCarriersRequest,
  DeleteDraftCarriersRequest,
  GetDraftCollectionDetailRequest,
  GetDraftExitLocationByIdRequest,
  GetDraftTransitCountriesRequest,
  GetDraftRecoveryFacilityDetailsRequest,
  ListDraftRecoveryFacilityDetailsRequest,
  DeleteDraftRecoveryFacilityDetailsRequest,
  schema,
  GetDraftSubmissionConfirmationByIdRequest,
  GetDraftSubmissionDeclarationByIdRequest,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getDraftsRequest = ajv.compileParser<GetDraftsRequest>(
  schema.getDraftsRequest
);

export const getDraftByIdRequest = ajv.compileParser<GetDraftByIdRequest>(
  schema.getDraftByIdRequest
);

export const createDraftRequest = ajv.compileParser<CreateDraftRequest>(
  schema.createDraftRequest
);

export const deleteDraftRequest = ajv.compileParser<DeleteDraftRequest>(
  schema.deleteDraftRequest
);

export const cancelDraftRequest = ajv.compileParser<CancelDraftByIdRequest>(
  schema.cancelDraftByIdRequest
);

export const getDraftCustomerReferenceByIdRequest =
  ajv.compileParser<GetDraftCustomerReferenceByIdRequest>(
    schema.getDraftCustomerReferenceByIdRequest
  );

export const getDraftWasteDescriptionByIdRequest =
  ajv.compileParser<GetDraftWasteDescriptionByIdRequest>(
    schema.getDraftWasteDescriptionByIdRequest
  );

export const getDraftWasteQuantityByIdRequest =
  ajv.compileParser<GetDraftWasteQuantityByIdRequest>(
    schema.getDraftWasteQuantityByIdRequest
  );

export const getDraftExporterDetailByIdRequest =
  ajv.compileParser<GetDraftExporterDetailByIdRequest>(
    schema.getDraftExporterDetailByIdRequest
  );

export const getDraftImporterDetailByIdRequest =
  ajv.compileParser<GetDraftImporterDetailByIdRequest>(
    schema.getDraftImporterDetailByIdRequest
  );

export const getDraftCollectionDateByIdRequest =
  ajv.compileParser<GetDraftCollectionDateByIdRequest>(
    schema.getDraftCollectionDateByIdRequest
  );

export const getDraftCarriersRequest =
  ajv.compileParser<GetDraftCarriersRequest>(schema.getDraftCarriersRequest);

export const listDraftCarriersRequest =
  ajv.compileParser<ListDraftCarriersRequest>(schema.listDraftCarriersRequest);

export const deleteDraftCarriersRequest =
  ajv.compileParser<DeleteDraftCarriersRequest>(
    schema.deleteDraftCarriersRequest
  );

export const getDraftCollectionDetailRequest =
  ajv.compileParser<GetDraftCollectionDetailRequest>(
    schema.getDraftCollectionDetailRequest
  );

export const getDraftExitLocationByIdRequest =
  ajv.compileParser<GetDraftExitLocationByIdRequest>(
    schema.getDraftExitLocationByIdRequest
  );

export const getDraftTransitCountriesRequest =
  ajv.compileParser<GetDraftTransitCountriesRequest>(
    schema.getDraftTransitCountriesRequest
  );

export const getDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<GetDraftRecoveryFacilityDetailsRequest>(
    schema.getDraftRecoveryFacilityDetailsRequest
  );

export const listDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<ListDraftRecoveryFacilityDetailsRequest>(
    schema.listDraftRecoveryFacilityDetailsRequest
  );

export const deleteDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<DeleteDraftRecoveryFacilityDetailsRequest>(
    schema.deleteDraftRecoveryFacilityDetailsRequest
  );

export const getDraftSubmissionConfirmationByIdRequest =
  ajv.compileParser<GetDraftSubmissionConfirmationByIdRequest>(
    schema.getDraftSubmissionConfirmationByIdByIdRequest
  );

export const getDraftSubmissionDeclarationByIdRequest =
  ajv.compileParser<GetDraftSubmissionDeclarationByIdRequest>(
    schema.getDraftSubmissionDeclarationByIdByIdRequest
  );
