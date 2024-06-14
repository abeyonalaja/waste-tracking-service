import { AccountIdRequest, IdRequest, OrderRequest, Method } from '../common';
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
export const getTemplates: Method = { name: 'getTemplates' };

export type GetNumberOfTemplatesRequest = AccountIdRequest;
export type GetNumberOfTemplatesResponse = Response<number>;
export const getNumberOfTemplates: Method = {
  name: 'getNumberOfTemplates',
};

export type GetTemplateRequest = IdRequest & AccountIdRequest;
export type GetTemplateResponse = Response<Template>;
export const getTemplate: Method = {
  name: 'getTemplate',
};

export type CreateTemplateRequest = AccountIdRequest & {
  templateDetails: TemplateDetailRequestValue;
};
export type CreateTemplateResponse = Response<Template>;
export const createTemplate: Method = {
  name: 'createTemplate',
};

export type CreateTemplateFromSubmissionRequest = AccountIdRequest & {
  id: string;
  templateDetails: TemplateDetailRequestValue;
};
export const createTemplateFromSubmission: Method = {
  name: 'createTemplateFromSubmission',
};

export type CreateTemplateFromTemplateRequest = AccountIdRequest & {
  id: string;
  templateDetails: TemplateDetailRequestValue;
};
export type CreateTemplateFromTemplateResponse = Response<Template>;
export const createTemplateFromTemplate: Method = {
  name: 'createTemplateFromTemplate',
};

export type UpdateTemplateRequest = IdRequest &
  AccountIdRequest & {
    templateDetails: TemplateDetailRequestValue;
  };
export type UpdateTemplateResponse = Response<Template>;
export const updateTemplate: Method = {
  name: 'updateTemplate',
};

export type DeleteTemplateRequest = IdRequest & AccountIdRequest;
export type DeleteTemplateResponse = Response<void>;
export const deleteTemplate: Method = {
  name: 'deleteTemplate',
};

export type CreateDraftFromTemplateRequest = IdRequest &
  AccountIdRequest & {
    reference: CustomerReference;
  };
export const createDraftFromTemplate: Method = {
  name: 'createDraftFromTemplate',
};

export const getTemplateWasteDescription: Method = {
  name: 'getTemplateWasteDescription',
};
export const setTemplateWasteDescription: Method = {
  name: 'setTemplateWasteDescription',
};
export const getTemplateExporterDetail: Method = {
  name: 'getTemplateExporterDetail',
};
export const setTemplateExporterDetail: Method = {
  name: 'setTemplateExporterDetail',
};
export const getTemplateImporterDetail: Method = {
  name: 'getTemplateImporterDetail',
};
export const setTemplateImporterDetail: Method = {
  name: 'setTemplateImporterDetail',
};
export const listTemplateCarriers: Method = {
  name: 'listTemplateCarriers',
};
export const getTemplateCarriers: Method = {
  name: 'getTemplateCarriers',
};
export const createTemplateCarriers: Method = {
  name: 'createTemplateCarriers',
};
export const setTemplateCarriers: Method = {
  name: 'setTemplateCarriers',
};
export const deleteTemplateCarriers: Method = {
  name: 'deleteTemplateCarriers',
};
export const getTemplateUkExitLocation: Method = {
  name: 'getTemplateUkExitLocation',
};
export const setTemplateUkExitLocation: Method = {
  name: 'setTemplateUkExitLocation',
};
export const getTemplateTransitCountries: Method = {
  name: 'getTemplateTransitCountries',
};
export const setTemplateTransitCountries: Method = {
  name: 'setTemplateTransitCountries',
};
export const getTemplateCollectionDetail: Method = {
  name: 'getTemplateCollectionDetail',
};
export const setTemplateCollectionDetail: Method = {
  name: 'setTemplateCollectionDetail',
};
export const listTemplateRecoveryFacilityDetails: Method = {
  name: 'listTemplateRecoveryFacilityDetails',
};
export const createTemplateRecoveryFacilityDetails: Method = {
  name: 'createTemplateRecoveryFacilityDetails',
};
export const getTemplateRecoveryFacilityDetails: Method = {
  name: 'getTemplateRecoveryFacilityDetails',
};
export const setTemplateRecoveryFacilityDetails: Method = {
  name: 'setTemplateRecoveryFacilityDetails',
};
export const deleteTemplateRecoveryFacilityDetails: Method = {
  name: 'deleteTemplateRecoveryFacilityDetails',
};
