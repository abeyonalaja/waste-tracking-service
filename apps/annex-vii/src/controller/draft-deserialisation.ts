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
  templateSchema,
  GetTemplatesRequest,
  GetTemplateByIdRequest,
  CreateTemplateRequest,
  DeleteTemplateRequest,
  CreateTemplateFromSubmissionRequest,
  CreateTemplateFromTemplateRequest,
  GetWasteCodesRequest,
  wtsInfoSchema,
  GetEWCCodesRequest,
  GetCountriesRequest,
  GetRecoveryCodesRequest,
  GetDisposalCodesRequest,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getDraftsRequest = ajv.compileParser<GetDraftsRequest>(
  submissionSchema.getDraftsRequest
);

export const getDraftByIdRequest = ajv.compileParser<GetDraftByIdRequest>(
  submissionSchema.getDraftByIdRequest
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

export const getTemplatesRequest = ajv.compileParser<GetTemplatesRequest>(
  templateSchema.getTemplatesRequest
);

export const getTemplateByIdRequest = ajv.compileParser<GetTemplateByIdRequest>(
  templateSchema.getTemplateByIdRequest
);

export const createTemplateRequest = ajv.compileParser<CreateTemplateRequest>(
  templateSchema.createTemplateRequest
);

export const createTemplateFromSubmissionRequest =
  ajv.compileParser<CreateTemplateFromSubmissionRequest>(
    templateSchema.createTemplateFromSubmissionRequest
  );

export const createTemplateFromTemplateRequest =
  ajv.compileParser<CreateTemplateFromTemplateRequest>(
    templateSchema.createTemplateFromTemplateRequest
  );

export const deleteTemplateRequest = ajv.compileParser<DeleteTemplateRequest>(
  templateSchema.deleteTemplateRequest
);

export const getWasteCodesRequest = ajv.compileParser<GetWasteCodesRequest>(
  wtsInfoSchema.getWasteCodesRequest
);
export const getEWCCodesRequest = ajv.compileParser<GetEWCCodesRequest>(
  wtsInfoSchema.getEWCCodesRequest
);
export const getCountriesRequest = ajv.compileParser<GetCountriesRequest>(
  wtsInfoSchema.getCountriesRequest
);
export const getRecoveryCodesRequest =
  ajv.compileParser<GetRecoveryCodesRequest>(
    wtsInfoSchema.getRecoveryCodesRequest
  );
export const getDisposalCodesRequest =
  ajv.compileParser<GetDisposalCodesRequest>(
    wtsInfoSchema.getDisposalCodesRequest
  );
