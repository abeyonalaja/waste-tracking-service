import { Response } from '@wts/util/invocation';

type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

type AccountIdRequest = { accountId: string };
type IdRequest = { id: string };

type DraftSectionSummary = {
  status: 'CannotStart' | 'NotStarted' | 'Started' | 'Complete';
};

export type CustomerReference = string | null;

type DraftWasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'Oecd' | 'AnnexIIIA' | 'AnnexIIIB';
        value: string;
      };
  ewcCodes: string[];
  nationalCode: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

export type DraftWasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<DraftWasteDescriptionData>)
  | ({ status: 'Complete' } & DraftWasteDescriptionData);

type DraftWasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        quantityType?: 'Volume' | 'Weight';
        value?: number;
      };
    }
  | {
      status: 'Complete';
      value:
        | {
            type: 'NotApplicable';
          }
        | {
            type: 'EstimateData' | 'ActualData';
            quantityType: 'Volume' | 'Weight';
            value: number;
          };
    };

type DraftExporterDetailData = {
  exporterAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode: string;
    country: string;
  };
  exporterContactDetails: {
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type DraftImporterDetailData = {
  importerContactDetails: {
    organisationName: string;
    address: string;
    country: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type DraftExporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<DraftExporterDetailData>)
  | ({ status: 'Complete' } & DraftExporterDetailData);

export type DraftImporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<DraftImporterDetailData>)
  | ({ status: 'Complete' } & DraftImporterDetailData);

type DraftRecoveryFacilityDetail =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' };

type NotStartedSection = { status: 'NotStarted' };

export type DraftSubmission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftWasteDescription;
  wasteQuantity: DraftWasteQuantity;
  exporterDetail: DraftExporterDetail;
  importerDetail: DraftImporterDetail;
  collectionDate: NotStartedSection;
  carriers: NotStartedSection;
  collectionDetail: NotStartedSection;
  ukExitLocation: NotStartedSection;
  transitCountries: NotStartedSection;
  recoveryFacilityDetail: DraftRecoveryFacilityDetail;
};

export type DraftSubmissionSummary = Readonly<{
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftSectionSummary;
  wasteQuantity: DraftSectionSummary;
  exporterDetail: DraftSectionSummary;
  importerDetail: DraftSectionSummary;
  collectionDate: DraftSectionSummary;
  carriers: DraftSectionSummary;
  collectionDetail: DraftSectionSummary;
  ukExitLocation: DraftSectionSummary;
  transitCountries: DraftSectionSummary;
  recoveryFacilityDetail: DraftSectionSummary;
}>;

export type GetDraftsRequest = AccountIdRequest;
export type GetDraftsResponse = Response<ReadonlyArray<DraftSubmissionSummary>>;
export const getDrafts: Method = { name: 'getDrafts', httpVerb: 'POST' };

export type GetDraftByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftByIdResponse = Response<DraftSubmission>;
export const getDraftById: Method = { name: 'getDraftById', httpVerb: 'POST' };

export type CreateDraftRequest = AccountIdRequest & {
  reference: CustomerReference;
};
export type CreateDraftResponse = Response<DraftSubmission>;
export const createDraft: Method = { name: 'createDraft', httpVerb: 'POST' };

export type GetDraftCustomerReferenceByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftCustomerReferenceByIdResponse = Response<CustomerReference>;
export const getDraftCustomerReferenceById: Method = {
  name: 'getDraftCustomerReferenceById',
  httpVerb: 'POST',
};

export type SetDraftCustomerReferenceByIdRequest = IdRequest &
  AccountIdRequest & { value: CustomerReference };
export type SetDraftCustomerReferenceByIdResponse = Response<void>;
export const setDraftCustomerReferenceById: Method = {
  name: 'setDraftCustomerReferenceById',
  httpVerb: 'POST',
};

export type GetDraftWasteDescriptionByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteDescriptionByIdResponse =
  Response<DraftWasteDescription>;
export const getDraftWasteDescriptionById: Method = {
  name: 'getDraftWasteDescriptionById',
  httpVerb: 'POST',
};

export type SetDraftWasteDescriptionByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftWasteDescription };
export type SetDraftWasteDescriptionByIdResponse = Response<void>;
export const setDraftWasteDescriptionById: Method = {
  name: 'setDraftWasteDescriptionById',
  httpVerb: 'POST',
};

export type GetDraftWasteQuantityByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteQuantityByIdResponse = Response<DraftWasteQuantity>;
export const getDraftWasteQuantityById: Method = {
  name: 'getDraftWasteQuantityById',
  httpVerb: 'POST',
};

export type SetDraftWasteQuantityByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftWasteQuantity };
export type SetDraftWasteQuantityByIdResponse = Response<void>;
export const setDraftWasteQuantityById: Method = {
  name: 'setDraftWasteQuantityById',
  httpVerb: 'POST',
};

export type GetDraftExporterDetailByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftExporterDetailByIdResponse = Response<DraftExporterDetail>;
export const getDraftExporterDetailById: Method = {
  name: 'getDraftExporterDetailById',
  httpVerb: 'POST',
};

export type SetDraftExporterDetailByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftExporterDetail };
export type SetDraftExporterDetailByIdResponse = Response<void>;
export const setDraftExporterDetailById: Method = {
  name: 'setDraftExporterDetailById',
  httpVerb: 'POST',
};

export type GetDraftImporterDetailByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftImporterDetailByIdResponse = Response<DraftImporterDetail>;
export const getDraftImporterDetailById: Method = {
  name: 'getDraftImporterDetailById',
  httpVerb: 'POST',
};

export type SetDraftImporterDetailByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftImporterDetail };
export type SetDraftImporterDetailByIdResponse = Response<void>;
export const setDraftImporterDetailById: Method = {
  name: 'setDraftImporterDetailById',
  httpVerb: 'POST',
};
