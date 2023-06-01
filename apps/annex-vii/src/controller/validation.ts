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
  schema,
} from '@wts/api/annex-vii';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const setDraftCustomerReferenceByIdRequest =
  ajv.compile<SetDraftCustomerReferenceByIdRequest>(
    schema.setDraftCustomerReferenceByIdRequest
  );

export const setDraftWasteDescriptionByIdRequest =
  ajv.compile<SetDraftWasteDescriptionByIdRequest>(
    schema.setDraftWasteDescriptionByIdRequest
  );

export const setDraftWasteQuantityByIdRequest =
  ajv.compile<SetDraftWasteQuantityByIdRequest>(
    schema.setDraftWasteQuantityByIdRequest
  );

export const setDraftExporterDetailByIdRequest =
  ajv.compile<SetDraftExporterDetailByIdRequest>(
    schema.setDraftExporterDetailByIdRequest
  );

export const setDraftImporterDetailByIdRequest =
  ajv.compile<SetDraftImporterDetailByIdRequest>(
    schema.setDraftImporterDetailByIdRequest
  );

export const setDraftCollectionDateByIdRequest =
  ajv.compile<SetDraftCollectionDateByIdRequest>(
    schema.setDraftCollectionDateByIdRequest
  );

export const createDraftCarriersRequest =
  ajv.compile<CreateDraftCarriersRequest>(schema.createDraftCarriersRequest);

export const setDraftCarriersRequest = ajv.compile<SetDraftCarriersRequest>(
  schema.setDraftCarriersRequest
);

export const setDraftCollectionDetailRequest =
  ajv.compile<SetDraftCollectionDetailRequest>(
    schema.setDraftCollectionDetailRequest
  );

export const setDraftExitLocationByIdRequest =
  ajv.compile<SetDraftExitLocationByIdRequest>(
    schema.setDraftExitLocationByIdRequest
  );

export const setDraftTransitCountriesRequest =
  ajv.compile<SetDraftTransitCountriesRequest>(
    schema.setDraftTransitCountriesRequest
  );
