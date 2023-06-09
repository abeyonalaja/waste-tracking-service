import { Response } from '@wts/util/invocation';

type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

type AccountIdRequest = { accountId: string };
type IdRequest = { id: string };
type CarrierIdRequest = { carrierId: string };
type RfdIdRequest = { rfdId: string };

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
  importerAddressDetails: {
    organisationName: string;
    address: string;
    country: string;
  };
  importerContactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type DraftCollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: {
        type: 'EstimateDate' | 'ActualDate';
        day: string;
        month: string;
        year: string;
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

export type DraftCarrierData = {
  addressDetails?: {
    organisationName: string;
    address: string;
    country: string;
  };
  contactDetails?: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  transportDetails?:
    | {
        type: 'ShippingContainer';
        shippingContainerNumber: string;
        vehicleRegistration?: string;
      }
    | {
        type: 'Trailer';
        vehicleRegistration: string;
        trailerNumber?: string;
      }
    | {
        type: 'BulkVessel';
        imo: string;
      };
};

export type DraftCarrier = { id: string } & DraftCarrierData;

export type DraftCarriers =
  | {
      status: 'NotStarted';
      transport: boolean;
    }
  | {
      status: 'Started' | 'Complete';
      transport: boolean;
      values: DraftCarrier[];
    };

type DraftCollectionDetailData = {
  address: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode: string;
    country: string;
  };
  contactDetails: {
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type DraftCollectionDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<DraftCollectionDetailData>)
  | ({ status: 'Complete' } & DraftCollectionDetailData);

export type DraftExitLocation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      exitLocation: { provided: 'Yes'; value: string } | { provided: 'No' };
    };

export type DraftTransitCountries =
  | { status: 'NotStarted' }
  | {
      status: 'Started' | 'Complete';
      values: string[];
    };

export type DraftRecoveryFacilityData = {
  addressDetails?: {
    name: string;
    address: string;
    country: string;
  };
  contactDetails?: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  recoveryFacilityType?:
    | {
        type: 'Laboratory';
        disposalCode: string;
      }
    | {
        type: 'InterimSite';
        recoveryCode: string;
      }
    | {
        type: 'RecoveryFacility';
        recoveryCode: string;
      };
};

export type DraftRecoveryFacility = { id: string } & DraftRecoveryFacilityData;

export type DraftRecoveryFacilityDetail =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Started' | 'Complete';
      values: DraftRecoveryFacility[];
    };

export type DraftSubmission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftWasteDescription;
  wasteQuantity: DraftWasteQuantity;
  exporterDetail: DraftExporterDetail;
  importerDetail: DraftImporterDetail;
  collectionDate: DraftCollectionDate;
  carriers: DraftCarriers;
  collectionDetail: DraftCollectionDetail;
  ukExitLocation: DraftExitLocation;
  transitCountries: DraftTransitCountries;
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

export type GetDraftCollectionDateByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftCollectionDateByIdResponse = Response<DraftCollectionDate>;
export const getDraftCollectionDateById: Method = {
  name: 'getDraftCollectionDateById',
  httpVerb: 'POST',
};

export type SetDraftCollectionDateByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftCollectionDate };
export type SetDraftCollectionDateByIdResponse = Response<void>;
export const setDraftCollectionDateById: Method = {
  name: 'setDraftCollectionDateById',
  httpVerb: 'POST',
};

export type ListDraftCarriersRequest = IdRequest & AccountIdRequest;
export type ListDraftCarriersResponse = Response<DraftCarriers>;
export const listDraftCarriers: Method = {
  name: 'listDraftCarriers',
  httpVerb: 'POST',
};

export type CreateDraftCarriersRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftCarriers, 'transport' | 'values'> };
export type CreateDraftCarriersResponse = Response<DraftCarriers>;
export const createDraftCarriers: Method = {
  name: 'createDraftCarriers',
  httpVerb: 'POST',
};

export type GetDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest;
export type GetDraftCarriersResponse = Response<DraftCarriers>;
export const getDraftCarriers: Method = {
  name: 'getDraftCarriers',
  httpVerb: 'POST',
};

export type SetDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest & { value: DraftCarriers };
export type SetDraftCarriersResponse = Response<void>;
export const setDraftCarriers: Method = {
  name: 'setDraftCarriers',
  httpVerb: 'POST',
};

export type DeleteDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest;
export type DeleteDraftCarriersResponse = Response<void>;
export const deleteDraftCarriers: Method = {
  name: 'deleteDraftCarriers',
  httpVerb: 'POST',
};

export type GetDraftExitLocationByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftExitLocationByIdResponse = Response<DraftExitLocation>;
export const getDraftExitLocationById: Method = {
  name: 'getDraftExitLocationById',
  httpVerb: 'POST',
};

export type SetDraftExitLocationByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftExitLocation };
export type SetDraftExitLocationByIdResponse = Response<void>;
export const setDraftExitLocationById: Method = {
  name: 'setDraftExitLocationById',
  httpVerb: 'POST',
};

export type GetDraftTransitCountriesRequest = IdRequest & AccountIdRequest;
export type GetDraftTransitCountriesResponse = Response<DraftTransitCountries>;
export const getDraftTransitCountries: Method = {
  name: 'getDraftTransitCountries',
  httpVerb: 'POST',
};

export type SetDraftTransitCountriesRequest = IdRequest &
  AccountIdRequest & { value: DraftTransitCountries };
export type SetDraftTransitCountriesResponse = Response<void>;
export const setDraftTransitCountries: Method = {
  name: 'setDraftTransitCountries',
  httpVerb: 'POST',
};

export type GetDraftCollectionDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftCollectionDetailResponse = Response<DraftCollectionDetail>;
export const getDraftCollectionDetail: Method = {
  name: 'getDraftCollectionDetail',
  httpVerb: 'POST',
};

export type SetDraftCollectionDetailRequest = IdRequest &
  AccountIdRequest & { value: DraftCollectionDetail };
export type SetDraftCollectionDetailResponse = Response<void>;
export const setDraftCollectionDetail: Method = {
  name: 'setDraftCollectionDetail',
  httpVerb: 'POST',
};

export type ListDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest;
export type ListDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetail>;
export const listDraftRecoveryFacilityDetails: Method = {
  name: 'listDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};

export type CreateDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftRecoveryFacilityDetail, 'values'> };
export type CreateDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetail>;
export const createDraftRecoveryFacilityDetails: Method = {
  name: 'createDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};

export type GetDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest;
export type GetDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetail>;
export const getDraftRecoveryFacilityDetails: Method = {
  name: 'getDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};

export type SetDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest & { value: DraftRecoveryFacilityDetail };
export type SetDraftRecoveryFacilityDetailsResponse = Response<void>;
export const setDraftRecoveryFacilityDetails: Method = {
  name: 'setDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};

export type DeleteDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest;
export type DeleteDraftRecoveryFacilityDetailsResponse = Response<void>;
export const deleteDraftRecoveryFacilityDetails: Method = {
  name: 'deleteDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
