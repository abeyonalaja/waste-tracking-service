import {
  SetDraftCustomerReferenceByIdRequest,
  SetDraftExporterDetailByIdRequest,
  SetDraftImporterDetailByIdRequest,
  SetDraftWasteDescriptionByIdRequest,
  SetDraftWasteQuantityByIdRequest,
  SetDraftCollectionDateByIdRequest,
  SetDraftCarriersRequest,
  CreateDraftCarriersRequest,
  SetDraftCollectionDetailRequest,
  SetDraftExitLocationByIdRequest,
  SetDraftTransitCountriesRequest,
  SetDraftRecoveryFacilityDetailsRequest,
  CreateDraftRecoveryFacilityDetailsRequest,
  submissionSchema,
  SetDraftSubmissionConfirmationByIdRequest,
  SetDraftSubmissionDeclarationByIdRequest,
  CancelDraftByIdRequest,
  submissionBaseSchema,
  CreateTemplateRequest,
  templateSchema,
  CreateTemplateFromSubmissionRequest,
  CreateTemplateFromTemplateRequest,
  DeleteTemplateRequest,
  CreateDraftFromTemplateRequest,
  UpdateTemplateRequest,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const setDraftCustomerReferenceByIdRequest =
  ajv.compile<SetDraftCustomerReferenceByIdRequest>(
    submissionSchema.setDraftCustomerReferenceByIdRequest
  );

export const setDraftWasteDescriptionByIdRequest =
  ajv.compile<SetDraftWasteDescriptionByIdRequest>(
    submissionBaseSchema.setDraftWasteDescriptionByIdRequest
  );

export const setDraftWasteQuantityByIdRequest =
  ajv.compile<SetDraftWasteQuantityByIdRequest>(
    submissionSchema.setDraftWasteQuantityByIdRequest
  );

export const setDraftExporterDetailByIdRequest =
  ajv.compile<SetDraftExporterDetailByIdRequest>(
    submissionBaseSchema.setDraftExporterDetailByIdRequest
  );

export const setDraftImporterDetailByIdRequest =
  ajv.compile<SetDraftImporterDetailByIdRequest>(
    submissionBaseSchema.setDraftImporterDetailByIdRequest
  );

export const setDraftCollectionDateByIdRequest =
  ajv.compile<SetDraftCollectionDateByIdRequest>(
    submissionSchema.setDraftCollectionDateByIdRequest
  );

export const createDraftCarriersRequest =
  ajv.compile<CreateDraftCarriersRequest>(
    submissionBaseSchema.createDraftCarriersRequest
  );

export const setDraftCarriersRequest = ajv.compile<SetDraftCarriersRequest>(
  submissionBaseSchema.setDraftCarriersRequest
);

export const setDraftCollectionDetailRequest =
  ajv.compile<SetDraftCollectionDetailRequest>(
    submissionBaseSchema.setDraftCollectionDetailRequest
  );

export const setDraftExitLocationByIdRequest =
  ajv.compile<SetDraftExitLocationByIdRequest>(
    submissionBaseSchema.setDraftExitLocationByIdRequest
  );

export const setDraftTransitCountriesRequest =
  ajv.compile<SetDraftTransitCountriesRequest>(
    submissionBaseSchema.setDraftTransitCountriesRequest
  );

export const createDraftRecoveryFacilityDetailsRequest =
  ajv.compile<CreateDraftRecoveryFacilityDetailsRequest>(
    submissionBaseSchema.createDraftRecoveryFacilityDetailsRequest
  );

export const setDraftRecoveryFacilityDetailsRequest =
  ajv.compile<SetDraftRecoveryFacilityDetailsRequest>(
    submissionBaseSchema.setDraftRecoveryFacilityDetailsRequest
  );

export const setDraftSubmissionConfirmationByIdRequest =
  ajv.compile<SetDraftSubmissionConfirmationByIdRequest>(
    submissionSchema.setDraftSubmissionConfirmationByIdRequest
  );

export const setDraftSubmissionDeclarationByIdRequest =
  ajv.compile<SetDraftSubmissionDeclarationByIdRequest>(
    submissionSchema.setDraftSubmissionDeclarationByIdRequest
  );

export const setDraftSubmissionCancellationByIdRequest =
  ajv.compile<CancelDraftByIdRequest>(submissionSchema.cancelDraftByIdRequest);

export const createTemplateRequest = ajv.compile<CreateTemplateRequest>(
  templateSchema.createTemplateRequest
);

export const createTemplateFromSubmissionRequest =
  ajv.compile<CreateTemplateFromSubmissionRequest>(
    templateSchema.createTemplateFromSubmissionRequest
  );

export const createTemplateFromTemplateRequest =
  ajv.compile<CreateTemplateFromTemplateRequest>(
    templateSchema.createTemplateFromTemplateRequest
  );

export const updateTemplateRequest = ajv.compile<UpdateTemplateRequest>(
  templateSchema.updateTemplateRequest
);

export const deleteTemplateRequest = ajv.compile<DeleteTemplateRequest>(
  templateSchema.deleteTemplateRequest
);

export const createDraftFromTemplateRequest =
  ajv.compile<CreateDraftFromTemplateRequest>(
    submissionSchema.createDraftFromTemplateRequest
  );
