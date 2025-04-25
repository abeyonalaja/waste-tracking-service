import { AccountIdRequest, IdRequest, Method } from '../common';
import { Response } from '@wts/util/invocation';
import {
  Carrier,
  CollectionDate,
  CollectionDetail,
  UkExitLocation,
  ExporterDetail,
  ImporterDetail,
  RecoveryFacilityDetail,
  SubmissionDeclaration,
  TransitCountry,
  WasteDescription,
  WasteQuantity,
} from '../submission';
import { CustomerReference, RecordState, RecordSummaryPage } from '../common';

interface CarrierIdRequest {
  carrierId: string;
}
interface RfdIdRequest {
  rfdId: string;
}

export type DraftWasteQuantityType =
  | 'NotApplicable'
  | 'EstimateData'
  | 'ActualData';

export type DraftSubmissionStateStatus = 'InProgress' | 'Deleted';

export type DraftWasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<WasteDescription>)
  | ({ status: 'Complete' } & WasteDescription);

export type DraftWasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: DraftWasteQuantityType;
        estimateData?: WasteQuantity['estimateData'];
        actualData?: WasteQuantity['actualData'];
      };
    }
  | {
      status: 'Complete';
      value:
        | {
            type: 'NotApplicable';
          }
        | WasteQuantity;
    };

export type DraftExporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<ExporterDetail>)
  | ({ status: 'Complete' } & ExporterDetail);

export type DraftImporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<ImporterDetail>)
  | ({ status: 'Complete' } & ImporterDetail);

export type DraftCollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: CollectionDate;
    };

export type DraftCarrierPartial = { id: string } & Partial<Carrier>;
export type DraftCarrier = { id: string } & Carrier;

export type DraftCarriers =
  | {
      status: 'NotStarted';
      transport: boolean;
    }
  | {
      status: 'Started';
      transport: boolean;
      values: DraftCarrierPartial[];
    }
  | {
      status: 'Complete';
      transport: boolean;
      values: DraftCarrier[];
    };

export type DraftCollectionDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<CollectionDetail>)
  | ({ status: 'Complete' } & CollectionDetail);

export type DraftUkExitLocation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      exitLocation: UkExitLocation;
    };

export type DraftTransitCountries =
  | { status: 'NotStarted' }
  | {
      status: 'Started' | 'Complete';
      values: TransitCountry[];
    };

export type DraftRecoveryFacilityPartial = {
  id: string;
} & Partial<RecoveryFacilityDetail>;
export type DraftRecoveryFacility = { id: string } & RecoveryFacilityDetail;

export type DraftRecoveryFacilityDetails =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Started';
      values: DraftRecoveryFacilityPartial[];
    }
  | {
      status: 'Complete';
      values: DraftRecoveryFacility[];
    };

export type DraftSubmissionConfirmation =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      confirmation: boolean;
    };

export type DraftSubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: SubmissionDeclaration;
    };

export interface DraftSubmission {
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftWasteDescription;
  wasteQuantity: DraftWasteQuantity;
  exporterDetail: DraftExporterDetail;
  importerDetail: DraftImporterDetail;
  collectionDate: DraftCollectionDate;
  carriers: DraftCarriers;
  collectionDetail: DraftCollectionDetail;
  ukExitLocation: DraftUkExitLocation;
  transitCountries: DraftTransitCountries;
  recoveryFacilityDetail: DraftRecoveryFacilityDetails;
  submissionConfirmation: DraftSubmissionConfirmation;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: RecordState;
}

export type DraftSubmissionSummary = Readonly<
  Omit<
    DraftSubmission,
    | 'wasteQuantity'
    | 'exporterDetail'
    | 'importerDetail'
    | 'carriers'
    | 'collectionDetail'
    | 'ukExitLocation'
    | 'transitCountries'
    | 'recoveryFacilityDetail'
    | 'submissionConfirmation'
  >
>;

export type GetDraftsResponse = Response<
  RecordSummaryPage<DraftSubmissionSummary>
>;
export const getDrafts: Method = { name: 'getDrafts' };

export type GetDraftRequest = IdRequest & AccountIdRequest;
export type GetDraftResponse = Response<DraftSubmission>;
export const getDraft: Method = { name: 'getDraft' };

export type CreateDraftRequest = AccountIdRequest & {
  reference: CustomerReference;
};
export type CreateDraftResponse = Response<DraftSubmission>;
export const createDraft: Method = { name: 'createDraft' };

export type DeleteDraftRequest = IdRequest & AccountIdRequest;
export type DeleteDraftResponse = Response<void>;
export const deleteDraft: Method = { name: 'deleteDraft' };

export type GetDraftCustomerReferenceRequest = IdRequest & AccountIdRequest;
export type GetDraftCustomerReferenceResponse = Response<CustomerReference>;
export const getDraftCustomerReference: Method = {
  name: 'getDraftCustomerReference',
};

export type SetDraftCustomerReferenceRequest = IdRequest &
  AccountIdRequest & { reference: CustomerReference };
export type SetDraftCustomerReferenceResponse = Response<void>;
export const setDraftCustomerReference: Method = {
  name: 'setDraftCustomerReference',
};

export type GetDraftWasteDescriptionRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteDescriptionResponse = Response<DraftWasteDescription>;
export const getDraftWasteDescription: Method = {
  name: 'getDraftWasteDescription',
};

export type SetDraftWasteDescriptionRequest = IdRequest &
  AccountIdRequest & { value: DraftWasteDescription };
export type SetDraftWasteDescriptionResponse = Response<void>;
export const setDraftWasteDescription: Method = {
  name: 'setDraftWasteDescription',
};

export type GetDraftWasteQuantityRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteQuantityResponse = Response<DraftWasteQuantity>;
export const getDraftWasteQuantity: Method = {
  name: 'getDraftWasteQuantity',
};

export type SetDraftWasteQuantityRequest = IdRequest &
  AccountIdRequest & { value: DraftWasteQuantity };
export type SetDraftWasteQuantityResponse = Response<void>;
export const setDraftWasteQuantity: Method = {
  name: 'setDraftWasteQuantity',
};

export type GetDraftExporterDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftExporterDetailResponse = Response<DraftExporterDetail>;
export const getDraftExporterDetail: Method = {
  name: 'getDraftExporterDetail',
};

export type SetDraftExporterDetailRequest = IdRequest &
  AccountIdRequest & { value: DraftExporterDetail };
export type SetDraftExporterDetailResponse = Response<void>;
export const setDraftExporterDetail: Method = {
  name: 'setDraftExporterDetail',
};

export type GetDraftImporterDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftImporterDetailResponse = Response<DraftImporterDetail>;
export const getDraftImporterDetail: Method = {
  name: 'getDraftImporterDetail',
};

export type SetDraftImporterDetailRequest = IdRequest &
  AccountIdRequest & { value: DraftImporterDetail };
export type SetDraftImporterDetailResponse = Response<void>;
export const setDraftImporterDetail: Method = {
  name: 'setDraftImporterDetail',
};

export type GetDraftCollectionDateRequest = IdRequest & AccountIdRequest;
export type GetDraftCollectionDateResponse = Response<DraftCollectionDate>;
export const getDraftCollectionDate: Method = {
  name: 'getDraftCollectionDate',
};

export type SetDraftCollectionDateRequest = IdRequest &
  AccountIdRequest & { value: DraftCollectionDate };
export type SetDraftCollectionDateResponse = Response<void>;
export const setDraftCollectionDate: Method = {
  name: 'setDraftCollectionDate',
};

export type ListDraftCarriersRequest = IdRequest & AccountIdRequest;
export type ListDraftCarriersResponse = Response<DraftCarriers>;
export const listDraftCarriers: Method = {
  name: 'listDraftCarriers',
};

export type CreateDraftCarriersRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftCarriers, 'transport' | 'values'> };
export type CreateDraftCarriersResponse = Response<DraftCarriers>;
export const getDraftCarriers: Method = {
  name: 'getDraftCarriers',
};

export type GetDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest;
export type GetDraftCarriersResponse = Response<DraftCarriers>;
export const createDraftCarriers: Method = {
  name: 'createDraftCarriers',
};

export type SetDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest & { value: DraftCarriers };
export type SetDraftCarriersResponse = Response<void>;
export const setDraftCarriers: Method = {
  name: 'setDraftCarriers',
};

export type DeleteDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest;
export type DeleteDraftCarriersResponse = Response<void>;
export const deleteDraftCarriers: Method = {
  name: 'deleteDraftCarriers',
};

export type GetDraftUkExitLocationRequest = IdRequest & AccountIdRequest;
export type GetDraftUkExitLocationResponse = Response<DraftUkExitLocation>;
export const getDraftUkExitLocation: Method = {
  name: 'getDraftUkExitLocation',
};

export type SetDraftUkExitLocationRequest = IdRequest &
  AccountIdRequest & { value: DraftUkExitLocation };
export type SetDraftUkExitLocationResponse = Response<void>;
export const setDraftUkExitLocation: Method = {
  name: 'setDraftUkExitLocation',
};

export type GetDraftTransitCountriesRequest = IdRequest & AccountIdRequest;
export type GetDraftTransitCountriesResponse = Response<DraftTransitCountries>;
export const getDraftTransitCountries: Method = {
  name: 'getDraftTransitCountries',
};

export type SetDraftTransitCountriesRequest = IdRequest &
  AccountIdRequest & { value: DraftTransitCountries };
export type SetDraftTransitCountriesResponse = Response<void>;
export const setDraftTransitCountries: Method = {
  name: 'setDraftTransitCountries',
};

export type GetDraftCollectionDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftCollectionDetailResponse = Response<DraftCollectionDetail>;
export const getDraftCollectionDetail: Method = {
  name: 'getDraftCollectionDetail',
};

export type SetDraftCollectionDetailRequest = IdRequest &
  AccountIdRequest & { value: DraftCollectionDetail };
export type SetDraftCollectionDetailResponse = Response<void>;
export const setDraftCollectionDetail: Method = {
  name: 'setDraftCollectionDetail',
};

export type ListDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest;
export type ListDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetails>;
export const listDraftRecoveryFacilityDetails: Method = {
  name: 'listDraftRecoveryFacilityDetails',
};

export type CreateDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftRecoveryFacilityDetails, 'values'> };
export type CreateDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetails>;
export const createDraftRecoveryFacilityDetails: Method = {
  name: 'createDraftRecoveryFacilityDetails',
};

export type GetDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest;
export type GetDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetails>;
export const getDraftRecoveryFacilityDetails: Method = {
  name: 'getDraftRecoveryFacilityDetails',
};

export type SetDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest & { value: DraftRecoveryFacilityDetails };
export type SetDraftRecoveryFacilityDetailsResponse = Response<void>;
export const setDraftRecoveryFacilityDetails: Method = {
  name: 'setDraftRecoveryFacilityDetails',
};

export type DeleteDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest;
export type DeleteDraftRecoveryFacilityDetailsResponse = Response<void>;
export const deleteDraftRecoveryFacilityDetails: Method = {
  name: 'deleteDraftRecoveryFacilityDetails',
};

export type GetDraftSubmissionConfirmationRequest = IdRequest &
  AccountIdRequest;
export type GetDraftSubmissionConfirmationResponse =
  Response<DraftSubmissionConfirmation>;
export const getDraftSubmissionConfirmation: Method = {
  name: 'getDraftSubmissionConfirmation',
};

export type SetDraftSubmissionConfirmationRequest = IdRequest &
  AccountIdRequest & { value: DraftSubmissionConfirmation };
export type SetDraftSubmissionConfirmationResponse = Response<void>;
export const setDraftSubmissionConfirmation: Method = {
  name: 'setDraftSubmissionConfirmation',
};

export type GetDraftSubmissionDeclarationRequest = IdRequest & AccountIdRequest;
export type GetDraftSubmissionDeclarationResponse =
  Response<DraftSubmissionDeclaration>;
export const getDraftSubmissionDeclaration: Method = {
  name: 'getDraftSubmissionDeclaration',
};

export type SetDraftSubmissionDeclarationRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftSubmissionDeclaration, 'values'> };
export type SetDraftSubmissionDeclarationResponse = Response<void>;
export const setDraftSubmissionDeclaration: Method = {
  name: 'setDraftSubmissionDeclaration',
};
