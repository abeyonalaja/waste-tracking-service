import { AccountIdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
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
  name: 'ukwmAddContentToBatch',
  httpVerb: 'POST',
};
export const getBatch: Method = {
  name: 'ukwmGetBatch',
  httpVerb: 'POST',
};
export const finalizeBatch: Method = {
  name: 'ukwmFinalizeBatch',
  httpVerb: 'POST',
};

export type GetBatchRequest = { id: string } & AccountIdRequest;
export type GetBatchResponse = Response<BulkSubmission>;

export type FinalizeBatchRequest = { id: string } & AccountIdRequest;
export type FinalizeBatchResponse = Response<void>;

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
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      transactionId: string;
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};
