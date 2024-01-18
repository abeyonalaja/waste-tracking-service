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
      submissions: SubmissionReference[];
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};

export type AddBatchContentRequest = AccountIdRequest & {
  batchId?: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};
export type AddBatchContentResponse = Response<{ batchId: string }>;
export const addBatchContent: Method = {
  name: 'addBatchContent',
  httpVerb: 'POST',
};

export type GetBatchContentRequest = IdRequest & AccountIdRequest;
export type GetBatchContentResponse = Response<BulkSubmission>;
export const getBatchContent: Method = {
  name: 'getBatchContent',
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
