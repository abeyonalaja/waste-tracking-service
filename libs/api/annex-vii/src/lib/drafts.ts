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

type CustomerReference = string | null;

type WasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'Oecd' | 'AnnexIIIA' | 'AnnexIIIB';
        value: string;
      };
  ecaCodes: string[];
  nationalCode: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

type DraftWasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<WasteDescriptionData>)
  | ({ status: 'Complete' } & WasteDescriptionData);

type DraftRecoveryFacilityDetail =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' };

type NotStartedSection = { status: 'NotStarted' };

type DraftWasteQuantity = { status: 'CannotStart' } | { status: 'NotStarted' };

export type DraftSubmission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftWasteDescription;
  wasteQuantity: DraftWasteQuantity;
  exporterDetail: NotStartedSection;
  importerDetail: NotStartedSection;
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
export const getDrafts: Method = { name: 'getDrafts', httpVerb: 'GET' };

export type GetDraftByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftByIdResponse = Response<DraftSubmission>;
export const getDraftById: Method = { name: 'getDraftById', httpVerb: 'GET' };

export type CreateDraftRequest = AccountIdRequest;
export type CreateDraftResponse = Response<DraftSubmission>;
export const createDraft: Method = { name: 'createDraft', httpVerb: 'POST' };
