import { Response } from '@wts/util/invocation';
import { submission } from '@wts/api/green-list-waste-export';

export type Method = Readonly<{
  name: string;
}>;
export interface AccountIdRequest {
  accountId: string;
}
export interface IdRequest {
  id: string;
}

export interface BulkSubmissionValidationRowError {
  rowNumber: number;
  errorAmount: number;
  errorDetails: string[];
}

export interface BulkSubmissionValidationRowErrorDetails {
  rowNumber: number;
  errorReason: string;
}

export interface BulkSubmissionValidationColumnError {
  errorAmount: number;
  columnName: string;
  errorDetails: BulkSubmissionValidationRowErrorDetails[];
}

export interface SubmissionFromBulkSummary {
  id: string;
  hasEstimates: boolean;
  reference: submission.Submission['reference'];
  wasteDescription: submission.Submission['wasteDescription'];
  collectionDate: submission.Submission['collectionDate'];
  submissionDeclaration: submission.Submission['submissionDeclaration'];
}

export type BulkSubmissionState =
  | {
      status: 'Processing';
      timestamp: Date;
    }
  | {
      status: 'FailedCsvValidation';
      timestamp: Date;
      error: string;
    }
  | {
      status: 'FailedValidation';
      timestamp: Date;
      rowErrors: BulkSubmissionValidationRowError[];
      columnErrors: BulkSubmissionValidationColumnError[];
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
      submissions: Omit<submission.PartialSubmission, 'id'>[];
    }
  | {
      status: 'Submitting';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
      submissions: Omit<submission.PartialSubmission, 'id'>[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      hasEstimates: boolean;
      transactionId: string;
      submissions: SubmissionFromBulkSummary[];
    };

export interface BulkSubmission {
  id: string;
  state: BulkSubmissionState;
}

export type AddContentToBatchRequest = AccountIdRequest & {
  batchId?: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};
export type AddContentToBatchResponse = Response<{ batchId: string }>;
export const addContentToBatch: Method = {
  name: 'addContentToBatch',
};

export type GetBatchRequest = IdRequest & AccountIdRequest;
export type GetBatchResponse = Response<BulkSubmission>;
export const getBatch: Method = {
  name: 'getBatch',
};

export type BulkSubmissionValidationSummary =
  | {
      success: true;
    }
  | {
      success: false;
      rowErrors: BulkSubmissionValidationRowError[];
      columnErrors: BulkSubmissionValidationColumnError[];
    };

export type ValidateBatchContentRequest = AccountIdRequest & {
  batchId?: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};

export type ValidateBatchContentResponse = Response<{ batchId: string }>;

export type UpdateBatchRequest = IdRequest & AccountIdRequest;
export type UpdateBatchResponse = Response<void>;
export const updateBatch: Method = {
  name: 'updateBatch',
};

export interface CustomerReferenceFlattened {
  reference: string;
}

export interface WasteCodeSubSectionFlattened {
  baselAnnexIXCode: string;
  oecdCode: string;
  annexIIIACode: string;
  annexIIIBCode: string;
  laboratory: string;
}

export interface WasteDescriptionSubSectionFlattened {
  ewcCodes: string;
  nationalCode: string;
  wasteDescription: string;
}

export type WasteDescriptionFlattened = WasteCodeSubSectionFlattened &
  WasteDescriptionSubSectionFlattened;

export interface WasteQuantityFlattened {
  wasteQuantityTonnes: string;
  wasteQuantityCubicMetres: string;
  wasteQuantityKilograms: string;
  estimatedOrActualWasteQuantity: string;
}

export interface ExporterDetailFlattened {
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
}

export interface ImporterDetailFlattened {
  importerOrganisationName: string;
  importerAddress: string;
  importerCountry: string;
  importerContactFullName: string;
  importerContactPhoneNumber: string;
  importerFaxNumber: string;
  importerEmailAddress: string;
}

export interface CollectionDateFlattened {
  wasteCollectionDate: string;
  estimatedOrActualCollectionDate: string;
}

export interface CarriersFlattened {
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
}

export interface CollectionDetailFlattened {
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
}

export interface ExitLocationFlattened {
  whereWasteLeavesUk: string;
}

export interface TransitCountriesFlattened {
  transitCountries: string;
}

export interface RecoveryFacilityDetailFlattened {
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
}

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

export type GetBatchContentRequest = IdRequest & AccountIdRequest;
export type GetBatchContentResponse = Response<submission.Submission[]>;
export const getBatchContent: Method = {
  name: 'getBatchContent',
};
