import {
  AccountIdRequest,
  IdRequest,
  OrderRequest,
  Method,
  SectionSummary,
} from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import {
  SubmissionBase,
  DraftWasteDescription,
  WasteDescriptionData,
  ExporterDetailData,
  ImporterDetailData,
  CarrierData,
  CollectionDetailData,
  ExitLocationData,
  RecoveryFacilityData,
} from './submissionBase.dto';
import { ValidationResult } from './validation';

export type CustomerReference = string;

type WasteQuantityData =
  | {
      type: 'NotApplicable';
    }
  | {
      type: 'EstimateData' | 'ActualData';
      estimateData: {
        quantityType?: 'Volume' | 'Weight';
        unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
        value?: number;
      };
      actualData: {
        quantityType?: 'Volume' | 'Weight';
        unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
        value?: number;
      };
    };

export type DraftWasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        estimateData?: {
          quantityType?: 'Volume' | 'Weight';
          unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
          value?: number;
        };
        actualData?: {
          quantityType?: 'Volume' | 'Weight';
          unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
          value?: number;
        };
      };
    }
  | {
      status: 'Complete';
      value: WasteQuantityData;
    };

type CollectionDateData = {
  type: 'EstimateDate' | 'ActualDate';
  estimateDate: {
    day?: string;
    month?: string;
    year?: string;
  };
  actualDate: {
    day?: string;
    month?: string;
    year?: string;
  };
};

export type DraftCollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: CollectionDateData;
    };

export type DraftSubmissionConfirmation =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      confirmation: boolean;
    };

export type SubmissionDeclarationData = {
  declarationTimestamp: Date;
  transactionId: string;
};

export type DraftSubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: SubmissionDeclarationData;
    };

export type DraftSubmissionCancellationType =
  | {
      type: 'ChangeOfRecoveryFacilityOrLaboratory';
    }
  | {
      type: 'NoLongerExportingWaste';
    }
  | {
      type: 'Other';
      reason: string;
    };

export type DraftSubmissionState =
  | {
      status:
        | 'InProgress'
        | 'Deleted'
        | 'SubmittedWithEstimates'
        | 'SubmittedWithActuals'
        | 'UpdatedWithActuals';
      timestamp: Date;
    }
  | {
      status: 'Cancelled';
      timestamp: Date;
      cancellationType: DraftSubmissionCancellationType;
    };

export interface DraftSubmission extends SubmissionBase {
  id: string;
  reference: CustomerReference;
  wasteQuantity: DraftWasteQuantity;
  collectionDate: DraftCollectionDate;
  submissionConfirmation: DraftSubmissionConfirmation;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: DraftSubmissionState;
}

export type Submission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescriptionData;
  wasteQuantity: WasteQuantityData;
  exporterDetail: ExporterDetailData;
  importerDetail: ImporterDetailData;
  collectionDate: CollectionDateData;
  carriers: CarrierData[];
  collectionDetail: CollectionDetailData;
  ukExitLocation: ExitLocationData;
  transitCountries: string[];
  recoveryFacilityDetail: RecoveryFacilityData[];
  submissionDeclaration: SubmissionDeclarationData;
  submissionState: DraftSubmissionState;
};

export type DraftSubmissionSummary = Readonly<{
  id: string;
  reference: CustomerReference;
  wasteDescription: DraftWasteDescription;
  wasteQuantity: SectionSummary;
  exporterDetail: SectionSummary;
  importerDetail: SectionSummary;
  collectionDate: DraftCollectionDate;
  carriers: SectionSummary;
  collectionDetail: SectionSummary;
  ukExitLocation: SectionSummary;
  transitCountries: SectionSummary;
  recoveryFacilityDetail: SectionSummary;
  submissionConfirmation: SectionSummary;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: DraftSubmissionState;
}>;

export type DraftSubmissionPageMetadata = {
  pageNumber: number;
  token: string;
};

export type DraftSubmissionSummaryPage = {
  totalSubmissions: number;
  totalPages: number;
  currentPage: number;
  pages: DraftSubmissionPageMetadata[];
  values: ReadonlyArray<DraftSubmissionSummary>;
};

export type GetDraftsRequest = AccountIdRequest &
  OrderRequest & {
    pageLimit?: number;
    state?: DraftSubmissionState['status'][];
    token?: string;
  };
export type GetDraftsResponse = Response<DraftSubmissionSummaryPage>;
export const getDrafts: Method = { name: 'getDrafts', httpVerb: 'POST' };

export type GetDraftByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftByIdResponse = Response<DraftSubmission>;
export const getDraftById: Method = { name: 'getDraftById', httpVerb: 'POST' };

export type NumberOfSubmissions = {
  completedWithActuals: number;
  completedWithEstimates: number;
  incomplete: number;
};
export type GetNumberOfSubmissionsRequest = AccountIdRequest;
export type GetNumberOfSubmissionsResponse = Response<NumberOfSubmissions>;
export const getNumberOfSubmissions: Method = {
  name: 'getNumberOfSubmissions',
  httpVerb: 'POST',
};

export type CreateDraftRequest = AccountIdRequest & {
  reference: CustomerReference;
};
export type CreateDraftFromTemplateRequest = IdRequest &
  AccountIdRequest & {
    reference: CustomerReference;
  };
export type CreateDraftResponse = Response<DraftSubmission>;
export const createDraft: Method = { name: 'createDraft', httpVerb: 'POST' };
export const createDraftFromTemplate: Method = {
  name: 'createDraftFromTemplate',
  httpVerb: 'POST',
};

export type DeleteDraftRequest = IdRequest & AccountIdRequest;
export type DeleteDraftResponse = Response<void>;
export const deleteDraft: Method = { name: 'deleteDraft', httpVerb: 'POST' };

export type CancelDraftByIdRequest = IdRequest &
  AccountIdRequest & { cancellationType: DraftSubmissionCancellationType };
export type CancelDraftByIdResponse = Response<void>;
export const cancelDraft: Method = { name: 'cancelDraft', httpVerb: 'POST' };

export type GetDraftCustomerReferenceByIdRequest = IdRequest & AccountIdRequest;
export type GetDraftCustomerReferenceByIdResponse = Response<CustomerReference>;
export const getDraftCustomerReferenceById: Method = {
  name: 'getDraftCustomerReferenceById',
  httpVerb: 'POST',
};

export type SetDraftCustomerReferenceByIdRequest = IdRequest &
  AccountIdRequest & { reference: CustomerReference };
export type SetDraftCustomerReferenceByIdResponse = Response<void>;
export const setDraftCustomerReferenceById: Method = {
  name: 'setDraftCustomerReferenceById',
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

export type GetDraftSubmissionConfirmationByIdRequest = IdRequest &
  AccountIdRequest;
export type GetDraftSubmissionConfirmationByIdResponse =
  Response<DraftSubmissionConfirmation>;
export const getDraftSubmissionConfirmationById: Method = {
  name: 'getDraftSubmissionConfirmationById',
  httpVerb: 'POST',
};

export type SetDraftSubmissionConfirmationByIdRequest = IdRequest &
  AccountIdRequest & { value: DraftSubmissionConfirmation };
export type SetDraftSubmissionConfirmationByIdResponse = Response<void>;
export const setDraftSubmissionConfirmationById: Method = {
  name: 'setDraftSubmissionConfirmationById',
  httpVerb: 'POST',
};

export type GetDraftSubmissionDeclarationByIdRequest = IdRequest &
  AccountIdRequest;
export type GetDraftSubmissionDeclarationByIdResponse =
  Response<DraftSubmissionDeclaration>;
export const getDraftSubmissionDeclarationById: Method = {
  name: 'getDraftSubmissionDeclarationById',
  httpVerb: 'POST',
};

export type SetDraftSubmissionDeclarationByIdRequest = IdRequest &
  AccountIdRequest & { value: Omit<DraftSubmissionDeclaration, 'values'> };
export type SetDraftSubmissionDeclarationByIdResponse = Response<void>;
export const setDraftSubmissionDeclarationById: Method = {
  name: 'setDraftSubmissionDeclarationById',
  httpVerb: 'POST',
};

export const getDraftWasteDescriptionById: Method = {
  name: 'getDraftWasteDescriptionById',
  httpVerb: 'POST',
};
export const setDraftWasteDescriptionById: Method = {
  name: 'setDraftWasteDescriptionById',
  httpVerb: 'POST',
};
export const getDraftExporterDetailById: Method = {
  name: 'getDraftExporterDetailById',
  httpVerb: 'POST',
};
export const setDraftExporterDetailById: Method = {
  name: 'setDraftExporterDetailById',
  httpVerb: 'POST',
};
export const getDraftImporterDetailById: Method = {
  name: 'getDraftImporterDetailById',
  httpVerb: 'POST',
};
export const setDraftImporterDetailById: Method = {
  name: 'setDraftImporterDetailById',
  httpVerb: 'POST',
};
export const listDraftCarriers: Method = {
  name: 'listDraftCarriers',
  httpVerb: 'POST',
};
export const getDraftCarriers: Method = {
  name: 'getDraftCarriers',
  httpVerb: 'POST',
};
export const createDraftCarriers: Method = {
  name: 'createDraftCarriers',
  httpVerb: 'POST',
};
export const setDraftCarriers: Method = {
  name: 'setDraftCarriers',
  httpVerb: 'POST',
};
export const deleteDraftCarriers: Method = {
  name: 'deleteDraftCarriers',
  httpVerb: 'POST',
};
export const getDraftExitLocationById: Method = {
  name: 'getDraftExitLocationById',
  httpVerb: 'POST',
};
export const setDraftExitLocationById: Method = {
  name: 'setDraftExitLocationById',
  httpVerb: 'POST',
};
export const getDraftTransitCountries: Method = {
  name: 'getDraftTransitCountries',
  httpVerb: 'POST',
};
export const setDraftTransitCountries: Method = {
  name: 'setDraftTransitCountries',
  httpVerb: 'POST',
};
export const getDraftCollectionDetail: Method = {
  name: 'getDraftCollectionDetail',
  httpVerb: 'POST',
};
export const setDraftCollectionDetail: Method = {
  name: 'setDraftCollectionDetail',
  httpVerb: 'POST',
};
export const listDraftRecoveryFacilityDetails: Method = {
  name: 'listDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const createDraftRecoveryFacilityDetails: Method = {
  name: 'createDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const getDraftRecoveryFacilityDetails: Method = {
  name: 'getDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const setDraftRecoveryFacilityDetails: Method = {
  name: 'setDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};
export const deleteDraftRecoveryFacilityDetails: Method = {
  name: 'deleteDraftRecoveryFacilityDetails',
  httpVerb: 'POST',
};

export type CustomerReferenceFlattened = {
  reference: string;
};

export type WasteDescriptionFlattened = {
  baselAnnexIXCode: string;
  oecdCode: string;
  annexIIIACode: string;
  annexIIIBCode: string;
  laboratory: string;
  ewcCodes: string;
  nationalCode: string;
  wasteDescription: string;
};

export type WasteQuantityFlattened = {
  wasteQuantityTonnes: string;
  wasteQuantityCubicMetres: string;
  wasteQuantityKilograms: string;
  estimatedOrActualWasteQuantity: string;
};

export type ExporterDetailFlattened = {
  exporterOrganisationName: string;
  exporterAddressLine1: string;
  exporterAddressLine2: string;
  exporterTownOrCity: string;
  exporterCountry: string;
  exporterPostcode: string;
  exporterContactFullName: string;
  exporterContactPhoneNumber: string;
  exporterFaxNumber: string;
  exporterEmailAddress: string;
};

export type ImporterDetailFlattened = {
  importerOrganisationName: string;
  importerAddress: string;
  importerCountry: string;
  importerContactFullName: string;
  importerContactPhoneNumber: string;
  importerFaxNumber: string;
  importerEmailAddress: string;
};

export type CollectionDateFlattened = {
  wasteCollectionDate: string;
  estimatedOrActualCollectionDate: string;
};

export type CarriersFlattened = {
  firstCarrierOrganisationName: string;
  firstCarrierAddress: string;
  firstCarrierCountry: string;
  firstCarrierContactFullName: string;
  firstCarrierContactPhoneNumber: string;
  firstCarrierFaxNumber: string;
  firstCarrierEmailAddress: string;
  firstCarrierMeansOfTransport: string;
  firstCarrierMeansOfTransportDetails: string;
  secondCarrierOrganisationName: string;
  secondCarrierAddress: string;
  secondCarrierCountry: string;
  secondCarrierContactFullName: string;
  secondCarrierContactPhoneNumber: string;
  secondCarrierFaxNumber: string;
  secondCarrierEmailAddress: string;
  secondCarrierMeansOfTransport: string;
  secondCarrierMeansOfTransportDetails: string;
  thirdCarrierOrganisationName: string;
  thirdCarrierAddress: string;
  thirdCarrierCountry: string;
  thirdCarrierContactFullName: string;
  thirdCarrierContactPhoneNumber: string;
  thirdCarrierFaxNumber: string;
  thirdCarrierEmailAddress: string;
  thirdCarrierMeansOfTransport: string;
  thirdCarrierMeansOfTransportDetails: string;
  fourthCarrierOrganisationName: string;
  fourthCarrierAddress: string;
  fourthCarrierCountry: string;
  fourthCarrierContactFullName: string;
  fourthCarrierContactPhoneNumber: string;
  fourthCarrierFaxNumber: string;
  fourthCarrierEmailAddress: string;
  fourthCarrierMeansOfTransport: string;
  fourthCarrierMeansOfTransportDetails: string;
  fifthCarrierOrganisationName: string;
  fifthCarrierAddress: string;
  fifthCarrierCountry: string;
  fifthCarrierContactFullName: string;
  fifthCarrierContactPhoneNumber: string;
  fifthCarrierFaxNumber: string;
  fifthCarrierEmailAddress: string;
  fifthCarrierMeansOfTransport: string;
  fifthCarrierMeansOfTransportDetails: string;
};

export type CollectionDetailFlattened = {
  wasteCollectionOrganisationName: string;
  wasteCollectionAddressLine1: string;
  wasteCollectionAddressLine2: string;
  wasteCollectionTownOrCity: string;
  wasteCollectionCountry: string;
  wasteCollectionPostcode: string;
  wasteCollectionContactFullName: string;
  wasteCollectionContactPhoneNumber: string;
  wasteCollectionFaxNumber: string;
  wasteCollectionEmailAddress: string;
};

export type ExitLocationFlattened = {
  whereWasteLeavesUk: string;
};

export type TransitCountriesFlattened = {
  transitCountries: string;
};

export type RecoveryFacilityDetailFlattened = {
  interimSiteOrganisationName: string;
  interimSiteAddress: string;
  interimSiteCountry: string;
  interimSiteContactFullName: string;
  interimSiteContactPhoneNumber: string;
  interimSiteFaxNumber: string;
  interimSiteEmailAddress: string;
  interimSiteRecoveryCode: string;
  laboratoryOrganisationName: string;
  laboratoryAddress: string;
  laboratoryCountry: string;
  laboratoryContactFullName: string;
  laboratoryContactPhoneNumber: string;
  laboratoryFaxNumber: string;
  laboratoryEmailAddress: string;
  laboratoryDisposalCode: string;
  firstRecoveryFacilityOrganisationName: string;
  firstRecoveryFacilityAddress: string;
  firstRecoveryFacilityCountry: string;
  firstRecoveryFacilityContactFullName: string;
  firstRecoveryFacilityContactPhoneNumber: string;
  firstRecoveryFacilityFaxNumber: string;
  firstRecoveryFacilityEmailAddress: string;
  firstRecoveryFacilityRecoveryCode: string;
  secondRecoveryFacilityOrganisationName: string;
  secondRecoveryFacilityAddress: string;
  secondRecoveryFacilityCountry: string;
  secondRecoveryFacilityContactFullName: string;
  secondRecoveryFacilityContactPhoneNumber: string;
  secondRecoveryFacilityFaxNumber: string;
  secondRecoveryFacilityEmailAddress: string;
  secondRecoveryFacilityRecoveryCode: string;
  thirdRecoveryFacilityOrganisationName: string;
  thirdRecoveryFacilityAddress: string;
  thirdRecoveryFacilityCountry: string;
  thirdRecoveryFacilityContactFullName: string;
  thirdRecoveryFacilityContactPhoneNumber: string;
  thirdRecoveryFacilityFaxNumber: string;
  thirdRecoveryFacilityEmailAddress: string;
  thirdRecoveryFacilityRecoveryCode: string;
  fourthRecoveryFacilityOrganisationName: string;
  fourthRecoveryFacilityAddress: string;
  fourthRecoveryFacilityCountry: string;
  fourthRecoveryFacilityContactFullName: string;
  fourthRecoveryFacilityContactPhoneNumber: string;
  fourthRecoveryFacilityFaxNumber: string;
  fourthRecoveryFacilityEmailAddress: string;
  fourthRecoveryFacilityRecoveryCode: string;
  fifthRecoveryFacilityOrganisationName: string;
  fifthRecoveryFacilityAddress: string;
  fifthRecoveryFacilityCountry: string;
  fifthRecoveryFacilityContactFullName: string;
  fifthRecoveryFacilityContactPhoneNumber: string;
  fifthRecoveryFacilityFaxNumber: string;
  fifthRecoveryFacilityEmailAddress: string;
  fifthRecoveryFacilityRecoveryCode: string;
};

export type SubmissionFlattened = CustomerReferenceFlattened &
  WasteDescriptionFlattened &
  WasteQuantityFlattened &
  ExporterDetailFlattened &
  ImporterDetailFlattened &
  CollectionDateFlattened &
  CarriersFlattened &
  CollectionDetailFlattened &
  ExitLocationFlattened &
  TransitCountriesFlattened &
  RecoveryFacilityDetailFlattened;

export type ValidateSubmissionsRequest = AccountIdRequest & {
  values: SubmissionFlattened[];
};
export type ValidateSubmissionsResponse = Response<ValidationResult>;
export const validateSubmissions: Method = {
  name: 'validateSubmissions',
  httpVerb: 'POST',
};
