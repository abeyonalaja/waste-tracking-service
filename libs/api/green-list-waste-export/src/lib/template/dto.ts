import {
  AccountIdRequest,
  IdRequest,
  OrderRequest,
  Method,
} from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import {
  DraftCarriers,
  DraftCollectionDetail,
  DraftUkExitLocation,
  DraftExporterDetail,
  DraftImporterDetail,
  DraftRecoveryFacilityDetails,
  DraftTransitCountries,
  DraftWasteDescription,
} from '../draft';
import { CustomerReference, PageMetadata } from '../common';

export interface TemplateDetail {
  name: string;
  description: string;
  created: Date;
  lastModified: Date;
}

export interface Template {
  id: string;
  templateDetails: TemplateDetail;
  wasteDescription: DraftWasteDescription;
  exporterDetail: DraftExporterDetail;
  importerDetail: DraftImporterDetail;
  carriers: DraftCarriers;
  collectionDetail: DraftCollectionDetail;
  ukExitLocation: DraftUkExitLocation;
  transitCountries: DraftTransitCountries;
  recoveryFacilityDetail: DraftRecoveryFacilityDetails;
}

export type TemplateSummary = Readonly<
  Omit<
    Template,
    | 'wasteDescription'
    | 'exporterDetail'
    | 'importerDetail'
    | 'carriers'
    | 'collectionDetail'
    | 'ukExitLocation'
    | 'transitCountries'
    | 'recoveryFacilityDetail'
  >
>;

export interface TemplateSummaryPage {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pages: PageMetadata[];
  values: ReadonlyArray<TemplateSummary>;
}

export type TemplateDetailRequestValue = Omit<
  TemplateDetail,
  'created' | 'lastModified'
>;

export type GetTemplatesRequest = AccountIdRequest &
  OrderRequest & {
    pageLimit?: number;
    token?: string;
  };
export type GetTemplatesResponse = Response<TemplateSummaryPage>;
export const getTemplates: Method = { name: 'getTemplates', httpVerb: 'POST' };

export type GetNumberOfTemplatesRequest = AccountIdRequest;
export type GetNumberOfTemplatesResponse = Response<number>;
export const getNumberOfTemplates: Method = {
  name: 'getNumberOfTemplates',
  httpVerb: 'POST',
};

export type GetTemplateRequest = IdRequest & AccountIdRequest;
export type GetTemplateResponse = Response<Template>;
export const getTemplate: Method = {
  name: 'getTemplate',
  httpVerb: 'POST',
};

export type CreateTemplateRequest = AccountIdRequest & {
  templateDetails: TemplateDetailRequestValue;
};
export type CreateTemplateResponse = Response<Template>;
export const createTemplate: Method = {
  name: 'createTemplate',
  httpVerb: 'POST',
};

export type CreateTemplateFromSubmissionRequest = AccountIdRequest & {
  id: string;
  templateDetails: TemplateDetailRequestValue;
};
export const createTemplateFromSubmission: Method = {
  name: 'createTemplateFromSubmission',
  httpVerb: 'POST',
};

export type CreateTemplateFromTemplateRequest = AccountIdRequest & {
  id: string;
  templateDetails: TemplateDetailRequestValue;
};
export type CreateTemplateFromTemplateResponse = Response<Template>;
export const createTemplateFromTemplate: Method = {
  name: 'createTemplateFromTemplate',
  httpVerb: 'POST',
};

export type UpdateTemplateRequest = IdRequest &
  AccountIdRequest & {
    templateDetails: TemplateDetailRequestValue;
  };
export type UpdateTemplateResponse = Response<Template>;
export const updateTemplate: Method = {
  name: 'updateTemplate',
  httpVerb: 'POST',
};

export type DeleteTemplateRequest = IdRequest & AccountIdRequest;
export type DeleteTemplateResponse = Response<void>;
export const deleteTemplate: Method = {
  name: 'deleteTemplate',
  httpVerb: 'POST',
};

export type CreateDraftFromTemplateRequest = IdRequest &
  AccountIdRequest & {
    reference: CustomerReference;
  };
export const createDraftFromTemplate: Method = {
  name: 'createDraftFromTemplate',
  httpVerb: 'POST',
};

export const getTemplateWasteDescription: Method = {
  name: 'getTemplateWasteDescription',
  httpVerb: 'POST',
};
export const setTemplateWasteDescription: Method = {
  name: 'setTemplateWasteDescription',
  httpVerb: 'POST',
};
export const getTemplateExporterDetail: Method = {
  name: 'getTemplateExporterDetail',
  httpVerb: 'POST',
};
export const setTemplateExporterDetail: Method = {
  name: 'setTemplateExporterDetail',
  httpVerb: 'POST',
};
export const getTemplateImporterDetail: Method = {
  name: 'getTemplateImporterDetail',
  httpVerb: 'POST',
};
export const setTemplateImporterDetail: Method = {
  name: 'setTemplateImporterDetail',
  httpVerb: 'POST',
};
export const listTemplateCarriers: Method = {
  name: 'listTemplateCarriers',
  httpVerb: 'POST',
};
export const getTemplateCarriers: Method = {
  name: 'getTemplateCarriers',
  httpVerb: 'POST',
};
export const createTemplateCarriers: Method = {
  name: 'createTemplateCarriers',
  httpVerb: 'POST',
};
export const setTemplateCarriers: Method = {
  name: 'setTemplateCarriers',
  httpVerb: 'POST',
};
export const deleteTemplateCarriers: Method = {
  name: 'deleteTemplateCarriers',
  httpVerb: 'POST',
};
export const getTemplateUkExitLocation: Method = {
  name: 'getTemplateUkExitLocation',
  httpVerb: 'POST',
};
export const setTemplateUkExitLocation: Method = {
  name: 'setTemplateUkExitLocation',
  httpVerb: 'POST',
};
export const getTemplateTransitCountries: Method = {
  name: 'getTemplateTransitCountries',
  httpVerb: 'POST',
};
export const setTemplateTransitCountries: Method = {
  name: 'setTemplateTransitCountries',
  httpVerb: 'POST',
};
export const getTemplateCollectionDetail: Method = {
  name: 'getTemplateCollectionDetail',
  httpVerb: 'POST',
};
export const setTemplateCollectionDetail: Method = {
  name: 'setTemplateCollectionDetail',
  httpVerb: 'POST',
};
export const listTemplateRecoveryFacilityDetails: Method = {
  name: 'listTemplateRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const createTemplateRecoveryFacilityDetails: Method = {
  name: 'createTemplateRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const getTemplateRecoveryFacilityDetails: Method = {
  name: 'getTemplateRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const setTemplateRecoveryFacilityDetails: Method = {
  name: 'setTemplateRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const deleteTemplateRecoveryFacilityDetails: Method = {
  name: 'deleteTemplateRecoveryFacilityDetails',
  httpVerb: 'POST',
};
