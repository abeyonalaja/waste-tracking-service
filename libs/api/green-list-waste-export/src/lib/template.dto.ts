import {
  AccountIdRequest,
  IdRequest,
  OrderRequest,
  Method,
  SectionSummary,
} from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { SubmissionBase } from './submissionBase.dto';

export type TemplateDetails = {
  name: string;
  description: string;
  created: Date;
  lastModified: Date;
};

export interface Template extends SubmissionBase {
  templateDetails: TemplateDetails;
}

export type TemplateSummary = Readonly<{
  id: string;
  templateDetails: TemplateDetails;
  wasteDescription: SectionSummary;
  exporterDetail: SectionSummary;
  importerDetail: SectionSummary;
  carriers: SectionSummary;
  collectionDetail: SectionSummary;
  ukExitLocation: SectionSummary;
  transitCountries: SectionSummary;
  recoveryFacilityDetail: SectionSummary;
}>;

export type TemplatePageMetadata = {
  pageNumber: number;
  token: string;
};

export type TemplateSummaryPage = {
  totalTemplates: number;
  totalPages: number;
  currentPage: number;
  pages: TemplatePageMetadata[];
  values: ReadonlyArray<TemplateSummary>;
};

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

export type GetTemplateByIdRequest = IdRequest & AccountIdRequest;
export type GetTemplateByIdResponse = Response<Template>;
export const getTemplateById: Method = {
  name: 'getTemplateById',
  httpVerb: 'POST',
};

export type CreateTemplateRequest = AccountIdRequest & {
  templateDetails: {
    name: string;
    description: string;
  };
};
export type CreateTemplateFromSubmissionRequest = AccountIdRequest & {
  id: string;
  templateDetails: {
    name: string;
    description: string;
  };
};
export type CreateTemplateFromTemplateRequest = AccountIdRequest & {
  id: string;
  templateDetails: {
    name: string;
    description: string;
  };
};
export type UpdateTemplateRequest = IdRequest &
  AccountIdRequest & {
    templateDetails: {
      name: string;
      description: string;
    };
  };
export type CreateTemplateResponse = Response<Template>;

export const createTemplate: Method = {
  name: 'createTemplate',
  httpVerb: 'POST',
};
export const createTemplateFromSubmission: Method = {
  name: 'createTemplateFromSubmission',
  httpVerb: 'POST',
};
export const createTemplateFromTemplate: Method = {
  name: 'createTemplateFromTemplate',
  httpVerb: 'POST',
};

export const updateTemplate: Method = {
  name: 'updateTemplate',
  httpVerb: 'POST',
};

export const deleteTemplate: Method = {
  name: 'deleteTemplate',
  httpVerb: 'POST',
};

export type UpdateTemplateResponse = Response<Template>;
export type DeleteTemplateRequest = IdRequest & AccountIdRequest;
export type DeleteTemplateResponse = Response<void>;

export const getTemplateWasteDescriptionById: Method = {
  name: 'getTemplateWasteDescriptionById',
  httpVerb: 'POST',
};
export const setTemplateWasteDescriptionById: Method = {
  name: 'setTemplateWasteDescriptionById',
  httpVerb: 'POST',
};
export const getTemplateExporterDetailById: Method = {
  name: 'getTemplateExporterDetailById',
  httpVerb: 'POST',
};
export const setTemplateExporterDetailById: Method = {
  name: 'setTemplateExporterDetailById',
  httpVerb: 'POST',
};
export const getTemplateImporterDetailById: Method = {
  name: 'getTemplateImporterDetailById',
  httpVerb: 'POST',
};
export const setTemplateImporterDetailById: Method = {
  name: 'setTemplateImporterDetailById',
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
export const getTemplateExitLocationById: Method = {
  name: 'getTemplateExitLocationById',
  httpVerb: 'POST',
};
export const setTemplateExitLocationById: Method = {
  name: 'setTemplateExitLocationById',
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
