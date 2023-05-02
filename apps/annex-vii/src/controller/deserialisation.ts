import {
  CreateDraftRequest,
  GetDraftByIdRequest,
  GetDraftCustomerReferenceByIdRequest,
  GetDraftExporterDetailByIdRequest,
  GetDraftWasteDescriptionByIdRequest,
  GetDraftWasteQuantityByIdRequest,
  GetDraftsRequest,
  schema,
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
