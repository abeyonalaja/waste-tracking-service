import { AccountIdRequest, IdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';

export type BulkSubmissionValidationError = {
  rowNumber: number;
  errorAmount: number;
  errorDescriptions: string[];
};

export type Submission = {
  id: string;
};

export type SubmissionReference = {
  id: string;
  transactionNumber: string;
};

export type BulkSubmissionState =
  | {
      status: 'Processing';
      timestamp: Date;
    }
  | {
      status: 'FailedValidation';
      timestamp: Date;
      errors: BulkSubmissionValidationError[];
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      drafts: Submission[];
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
      errors: BulkSubmissionValidationError[];
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
