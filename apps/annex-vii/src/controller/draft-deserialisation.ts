import {
  CreateDraftRequest,
  DeleteDraftRequest,
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
  submissionSchema,
  submissionBaseSchema,
  GetDraftSubmissionConfirmationByIdRequest,
  GetDraftSubmissionDeclarationByIdRequest,
  GetNumberOfSubmissionsRequest,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getDraftsRequest = ajv.compileParser<GetDraftsRequest>(
  submissionSchema.getDraftsRequest
);

export const getDraftByIdRequest = ajv.compileParser<GetDraftByIdRequest>(
  submissionSchema.getDraftByIdRequest
);

export const getNumberOfSubmissionsRequest =
  ajv.compileParser<GetNumberOfSubmissionsRequest>(
    submissionSchema.getNumberOfSubmissionsRequest
  );

export const createDraftRequest = ajv.compileParser<CreateDraftRequest>(
  submissionSchema.createDraftRequest
);

export const deleteDraftRequest = ajv.compileParser<DeleteDraftRequest>(
  submissionSchema.deleteDraftRequest
);

export const getDraftCustomerReferenceByIdRequest =
  ajv.compileParser<GetDraftCustomerReferenceByIdRequest>(
    submissionSchema.getDraftCustomerReferenceByIdRequest
  );

export const getDraftWasteDescriptionByIdRequest =
  ajv.compileParser<GetDraftWasteDescriptionByIdRequest>(
    submissionBaseSchema.getDraftWasteDescriptionByIdRequest
  );

export const getDraftWasteQuantityByIdRequest =
  ajv.compileParser<GetDraftWasteQuantityByIdRequest>(
    submissionSchema.getDraftWasteQuantityByIdRequest
  );

export const getDraftExporterDetailByIdRequest =
  ajv.compileParser<GetDraftExporterDetailByIdRequest>(
    submissionBaseSchema.getDraftExporterDetailByIdRequest
  );

export const getDraftImporterDetailByIdRequest =
  ajv.compileParser<GetDraftImporterDetailByIdRequest>(
    submissionBaseSchema.getDraftImporterDetailByIdRequest
  );

export const getDraftCollectionDateByIdRequest =
  ajv.compileParser<GetDraftCollectionDateByIdRequest>(
    submissionSchema.getDraftCollectionDateByIdRequest
  );

export const getDraftCarriersRequest =
  ajv.compileParser<GetDraftCarriersRequest>(
    submissionBaseSchema.getDraftCarriersRequest
  );

export const listDraftCarriersRequest =
  ajv.compileParser<ListDraftCarriersRequest>(
    submissionBaseSchema.listDraftCarriersRequest
  );

export const deleteDraftCarriersRequest =
  ajv.compileParser<DeleteDraftCarriersRequest>(
    submissionBaseSchema.deleteDraftCarriersRequest
  );

export const getDraftCollectionDetailRequest =
  ajv.compileParser<GetDraftCollectionDetailRequest>(
    submissionBaseSchema.getDraftCollectionDetailRequest
  );

export const getDraftExitLocationByIdRequest =
  ajv.compileParser<GetDraftExitLocationByIdRequest>(
    submissionBaseSchema.getDraftExitLocationByIdRequest
  );

export const getDraftTransitCountriesRequest =
  ajv.compileParser<GetDraftTransitCountriesRequest>(
    submissionBaseSchema.getDraftTransitCountriesRequest
  );

export const getDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<GetDraftRecoveryFacilityDetailsRequest>(
    submissionBaseSchema.getDraftRecoveryFacilityDetailsRequest
  );

export const listDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<ListDraftRecoveryFacilityDetailsRequest>(
    submissionBaseSchema.listDraftRecoveryFacilityDetailsRequest
  );

export const deleteDraftRecoveryFacilityDetailsRequest =
  ajv.compileParser<DeleteDraftRecoveryFacilityDetailsRequest>(
    submissionBaseSchema.deleteDraftRecoveryFacilityDetailsRequest
  );

export const getDraftSubmissionConfirmationByIdRequest =
  ajv.compileParser<GetDraftSubmissionConfirmationByIdRequest>(
    submissionSchema.getDraftSubmissionConfirmationByIdByIdRequest
  );

export const getDraftSubmissionDeclarationByIdRequest =
  ajv.compileParser<GetDraftSubmissionDeclarationByIdRequest>(
    submissionSchema.getDraftSubmissionDeclarationByIdByIdRequest
  );
