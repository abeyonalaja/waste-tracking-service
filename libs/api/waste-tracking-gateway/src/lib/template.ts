import {
  PageMetadata,
  WasteDescription,
  ExporterDetail,
  ImporterDetail,
  Carriers,
  CollectionDetail,
  ExitLocation,
  TransitCountries,
  RecoveryFacilityDetail,
  AccountIdRequest,
} from './submission';

export interface TemplateDetails {
  name: string;
  description: string;
  created: Date;
  lastModified: Date;
}

export interface Template {
  id: string;
  wasteDescription: WasteDescription;
  exporterDetail: ExporterDetail;
  importerDetail: ImporterDetail;
  carriers: Carriers;
  collectionDetail: CollectionDetail;
  ukExitLocation: ExitLocation;
  transitCountries: TransitCountries;
  recoveryFacilityDetail: RecoveryFacilityDetail;
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
