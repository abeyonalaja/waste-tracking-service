import { AccountIdRequest } from '@wts/api/common';
import { PageMetadata, SubmissionBase } from './submission';

export interface TemplateDetails {
  name: string;
  description: string;
  created: Date;
  lastModified: Date;
}

export interface Template extends SubmissionBase {
  templateDetails: TemplateDetails;
}

export interface TemplatePageMetadata {
  pageNumber: number;
  token: string;
}

export interface TemplateSummaryPage {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pages: PageMetadata[];
  values: ReadonlyArray<TemplateSummary>;
}

export interface TemplateSummary {
  id: string;
  templateDetails: TemplateDetails;
}

export type GetTemplatesResponse = TemplateSummaryPage;

export type GetTemplateResponse = Template;
export type CreateTemplateRequest = Pick<Template, 'templateDetails'>;
export type CreateTemplateResponse = Template;
export type GetNumberOfTemplatesRequest = AccountIdRequest;
export type GetNumberOfTemplatesResponse = number;
