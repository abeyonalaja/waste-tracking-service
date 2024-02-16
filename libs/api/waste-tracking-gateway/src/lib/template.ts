import { AccountIdRequest, SectionSummary } from '@wts/api/common';
import { SubmissionBase } from './submissionBase';

export type TemplateDetails = {
  name: string;
  description: string;
  created: Date;
  lastModified: Date;
};

export interface Template extends SubmissionBase {
  templateDetails: TemplateDetails;
}

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

export type TemplateSummary = {
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
};

export type GetTemplatesResponse = TemplateSummaryPage;

export type GetTemplateResponse = Template;
export type CreateTemplateRequest = Pick<Template, 'templateDetails'>;
export type CreateTemplateResponse = Template;
export type GetNumberOfTemplatesRequest = AccountIdRequest;
export type GetNumberOfTemplatesResponse = number;
