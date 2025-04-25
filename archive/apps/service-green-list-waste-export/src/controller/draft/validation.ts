import { draft as api } from '@wts/api/green-list-waste-export';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const createDraftRequest = ajv.compile<api.CreateDraftRequest>(
  api.schema.createDraftRequest,
);

export const setDraftCustomerReferenceRequest =
  ajv.compile<api.SetDraftCustomerReferenceRequest>(
    api.schema.setDraftCustomerReferenceRequest,
  );

export const setDraftWasteDescriptionRequest =
  ajv.compile<api.SetDraftWasteDescriptionRequest>(
    api.schema.setDraftWasteDescriptionRequest,
  );

export const setDraftWasteQuantityRequest =
  ajv.compile<api.SetDraftWasteQuantityRequest>(
    api.schema.setDraftWasteQuantityRequest,
  );

export const setDraftExporterDetailRequest =
  ajv.compile<api.SetDraftExporterDetailRequest>(
    api.schema.setDraftExporterDetailRequest,
  );

export const setDraftImporterDetailRequest =
  ajv.compile<api.SetDraftImporterDetailRequest>(
    api.schema.setDraftImporterDetailRequest,
  );

export const setDraftCollectionDateRequest =
  ajv.compile<api.SetDraftCollectionDateRequest>(
    api.schema.setDraftCollectionDateRequest,
  );

export const createDraftCarriersRequest =
  ajv.compile<api.CreateDraftCarriersRequest>(
    api.schema.createDraftCarriersRequest,
  );

export const setDraftCarriersRequest = ajv.compile<api.SetDraftCarriersRequest>(
  api.schema.setDraftCarriersRequest,
);

export const setDraftCollectionDetailRequest =
  ajv.compile<api.SetDraftCollectionDetailRequest>(
    api.schema.setDraftCollectionDetailRequest,
  );

export const setDraftExitLocationRequest =
  ajv.compile<api.SetDraftUkExitLocationRequest>(
    api.schema.setDraftUkExitLocationRequest,
  );

export const setDraftTransitCountriesRequest =
  ajv.compile<api.SetDraftTransitCountriesRequest>(
    api.schema.setDraftTransitCountriesRequest,
  );

export const createDraftRecoveryFacilityDetailsRequest =
  ajv.compile<api.CreateDraftRecoveryFacilityDetailsRequest>(
    api.schema.createDraftRecoveryFacilityDetailsRequest,
  );

export const setDraftRecoveryFacilityDetailsRequest =
  ajv.compile<api.SetDraftRecoveryFacilityDetailsRequest>(
    api.schema.setDraftRecoveryFacilityDetailsRequest,
  );

export const setDraftSubmissionConfirmationRequest =
  ajv.compile<api.SetDraftSubmissionConfirmationRequest>(
    api.schema.setDraftSubmissionConfirmationRequest,
  );

export const setDraftSubmissionDeclarationRequest =
  ajv.compile<api.SetDraftSubmissionDeclarationRequest>(
    api.schema.setDraftSubmissionDeclarationRequest,
  );
