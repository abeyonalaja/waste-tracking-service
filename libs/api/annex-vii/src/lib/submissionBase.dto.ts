import { AccountIdRequest, IdRequest } from '@wts/api/common';
import { Response } from '@wts/util/invocation';

type CarrierIdRequest = { carrierId: string };
type RfdIdRequest = { rfdId: string };

type DraftWasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'OECD' | 'AnnexIIIA' | 'AnnexIIIB';
        code: string;
      };
  ewcCodes: object[];
  nationalCode?: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

export type DraftWasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<DraftWasteDescriptionData>)
  | ({ status: 'Complete' } & DraftWasteDescriptionData);

type DraftExporterDetailData = {
  exporterAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode?: string;
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
  transportDetails?: {
    type: 'Road' | 'Air' | 'Sea' | 'Rail' | 'InlandWaterways';
    description?: string;
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

export type SubmissionBase = {
  id: string;
  wasteDescription: DraftWasteDescription;
  exporterDetail: DraftExporterDetail;
  importerDetail: DraftImporterDetail;
  carriers: DraftCarriers;
  collectionDetail: DraftCollectionDetail;
  ukExitLocation: DraftExitLocation;
  transitCountries: DraftTransitCountries;
  recoveryFacilityDetail: DraftRecoveryFacilityDetail;
};

export type GetDraftWasteDescriptionByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteDescriptionByIdResponse =
  Response<DraftWasteDescription>;

export type SetDraftWasteDescriptionByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftWasteDescription };
export type SetDraftWasteDescriptionByIdResponse = Response<void>;

export type GetDraftExporterDetailByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftExporterDetailByIdResponse = Response<DraftExporterDetail>;

export type SetDraftExporterDetailByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftExporterDetail };
export type SetDraftExporterDetailByIdResponse = Response<void>;

export type GetDraftImporterDetailByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftImporterDetailByIdResponse = Response<DraftImporterDetail>;

export type SetDraftImporterDetailByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftImporterDetail };
export type SetDraftImporterDetailByIdResponse = Response<void>;

export type ListDraftCarriersRequest = IdRequest & AccountIdRequest;
export type ListDraftCarriersResponse = Response<DraftCarriers>;

export type CreateDraftCarriersRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftCarriers, 'transport' | 'values'> };
export type CreateDraftCarriersResponse = Response<DraftCarriers>;

export type GetDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest;
export type GetDraftCarriersResponse = Response<DraftCarriers>;

export type SetDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest & { value: DraftCarriers };
export type SetDraftCarriersResponse = Response<void>;

export type DeleteDraftCarriersRequest = IdRequest &
  AccountIdRequest &
  CarrierIdRequest;
export type DeleteDraftCarriersResponse = Response<void>;

export type GetDraftExitLocationByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftExitLocationByIdResponse = Response<DraftExitLocation>;

export type SetDraftExitLocationByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftExitLocation };
export type SetDraftExitLocationByIdResponse = Response<void>;

export type GetDraftTransitCountriesRequest = IdRequest & AccountIdRequest;
export type GetDraftTransitCountriesResponse = Response<DraftTransitCountries>;

export type SetDraftTransitCountriesRequest = IdRequest &
  AccountIdRequest & { value: DraftTransitCountries };
export type SetDraftTransitCountriesResponse = Response<void>;

export type GetDraftCollectionDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftCollectionDetailResponse = Response<DraftCollectionDetail>;

export type SetDraftCollectionDetailRequest = IdRequest &
  AccountIdRequest & { value: DraftCollectionDetail };
export type SetDraftCollectionDetailResponse = Response<void>;

export type ListDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest;
export type ListDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetail>;

export type CreateDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftRecoveryFacilityDetail, 'values'> };
export type CreateDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetail>;

export type GetDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest;
export type GetDraftRecoveryFacilityDetailsResponse =
  Response<DraftRecoveryFacilityDetail>;

export type SetDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest & { value: DraftRecoveryFacilityDetail };
export type SetDraftRecoveryFacilityDetailsResponse = Response<void>;

export type DeleteDraftRecoveryFacilityDetailsRequest = IdRequest &
  AccountIdRequest &
  RfdIdRequest;
export type DeleteDraftRecoveryFacilityDetailsResponse = Response<void>;
