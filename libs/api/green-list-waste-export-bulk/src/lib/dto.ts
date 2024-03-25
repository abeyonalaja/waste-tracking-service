import { AccountIdRequest, IdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { Submission } from '@wts/api/green-list-waste-export';

export type BulkSubmissionValidationRowError = {
  rowNumber: number;
  errorAmount: number;
  errorDetails: string[];
};

export type BulkSubmissionValidationRowErrorDetails = {
  rowNumber: number;
  errorReason: string;
};

export type BulkSubmissionValidationColumnError = {
  errorAmount: number;
  columnName: string;
  errorDetails: BulkSubmissionValidationRowErrorDetails[];
};

export type PartialSubmission = {
  reference: Submission['reference'];
  wasteDescription: Submission['wasteDescription'];
  wasteQuantity: Submission['wasteQuantity'];
};

export type SubmissionReference = {
  id: string;
  transactionId: string;
};

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
      submissions: PartialSubmission[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      transactionId: string;
      submissions: SubmissionReference[];
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};

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
  httpVerb: 'POST',
};

export type GetBatchRequest = IdRequest & AccountIdRequest;
export type GetBatchResponse = Response<BulkSubmission>;
export const getBatch: Method = {
  name: 'getBatch',
  httpVerb: 'POST',
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
  exporterContactFullname: string;
  exporterContactPhoneNumber: string;
  exporterFaxNumber: string;
  exporterEmailAddress: string;
};

export type ImporterDetailFlattened = {
  importerOrganisationName: string;
  importerAddress: string;
  importerCountry: string;
  importerContactFullname: string;
  importerContactPhoneNumber: string;
  importerFaxNumber: string;
  importerEmailAddress: string;
};

export type SubmissionFlattened = CustomerReferenceFlattened &
  WasteDescriptionFlattened &
  WasteQuantityFlattened &
  ExporterDetailFlattened &
  ImporterDetailFlattened;
