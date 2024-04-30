import { draft as api, common } from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getDraftsRequest = ajv.compileParser<common.GetRecordsRequest>(
  common.schema.getRecordsRequest
);

export const getDraftRequest = ajv.compileParser<api.GetDraftRequest>(
  api.schema.getDraftRequest
);

export const deleteDraftRequest = ajv.compileParser<api.DeleteDraftRequest>(
  api.schema.deleteDraftRequest
);

export const getDraftCustomerReferenceRequest =
  ajv.compileParser<api.GetDraftCustomerReferenceRequest>(
    api.schema.getDraftCustomerReferenceRequest
  );

export const getDraftWasteDescriptionRequest =
  ajv.compileParser<api.GetDraftWasteDescriptionRequest>(
    api.schema.getDraftWasteDescriptionRequest
  );

export const getDraftWasteQuantityRequest =
  ajv.compileParser<api.GetDraftWasteQuantityRequest>(
    api.schema.getDraftWasteQuantityRequest
  );

export const getDraftExporterDetailRequest =
  ajv.compileParser<api.GetDraftExporterDetailRequest>(
    api.schema.getDraftExporterDetailRequest
  );

export const getDraftImporterDetailRequest =
  ajv.compileParser<api.GetDraftImporterDetailRequest>(
    api.schema.getDraftImporterDetailRequest
  );

export const getDraftCollectionDateRequest =
  ajv.compileParser<api.GetDraftCollectionDateRequest>(
    api.schema.getDraftCollectionDateRequest
  );

export const getDraftCarriersRequest =
  ajv.compileParser<api.GetDraftCarriersRequest>(
    api.schema.getDraftCarriersRequest
  );

export const listDraftCarriersRequest =
  ajv.compileParser<api.ListDraftCarriersRequest>(
    api.schema.listDraftCarriersRequest
  );

export const deleteDraftCarriersRequest =
  ajv.compileParser<api.DeleteDraftCarriersRequest>(
    api.schema.deleteDraftCarriersRequest
  );

export const getDraftCollectionDetailRequest =
  ajv.compileParser<api.GetDraftCollectionDetailRequest>(
    api.schema.getDraftCollectionDetailRequest
  );

export const getDraftExitLocationRequest =
  ajv.compileParser<api.GetDraftUkExitLocationRequest>(
    api.schema.getDraftUkExitLocationRequest
  );

export const getDraftTransitCountriesRequest =
  ajv.compileParser<api.GetDraftTransitCountriesRequest>(
    api.schema.getDraftTransitCountriesRequest
  );

export const getDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<api.GetDraftRecoveryFacilityDetailsRequest>(
    api.schema.getDraftRecoveryFacilityDetailsRequest
  );

export const listDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<api.ListDraftRecoveryFacilityDetailsRequest>(
    api.schema.listDraftRecoveryFacilityDetailsRequest
  );

export const deleteDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<api.DeleteDraftRecoveryFacilityDetailsRequest>(
    api.schema.deleteDraftRecoveryFacilityDetailsRequest
  );

export const getDraftSubmissionConfirmationRequest =
  ajv.compileParser<api.GetDraftSubmissionConfirmationRequest>(
    api.schema.getDraftSubmissionConfirmationRequest
  );

export const getDraftSubmissionDeclarationRequest =
  ajv.compileParser<api.GetDraftSubmissionDeclarationRequest>(
    api.schema.getDraftSubmissionDeclarationRequest
  );
