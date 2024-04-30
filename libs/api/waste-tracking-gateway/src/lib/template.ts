import { AccountIdRequest } from '@wts/api/common';
import { PageMetadata, SubmissionBase } from './submission';

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
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pages: PageMetadata[];
  values: ReadonlyArray<TemplateSummary>;
};

export type TemplateSummary = {
  id: string;
  templateDetails: TemplateDetails;
};

export type GetTemplatesResponse = TemplateSummaryPage;

export type GetTemplateResponse = Template;
export type CreateTemplateRequest = Pick<Template, 'templateDetails'>;
export type CreateTemplateResponse = Template;
export type GetNumberOfTemplatesRequest = AccountIdRequest;
export type GetNumberOfTemplatesResponse = number;
