import {
  CreateDraftRequest,
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
