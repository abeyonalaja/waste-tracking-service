import * as api from '@wts/api/annex-vii-bulk';
import { BulkSubmissionCsvRow } from './lib/csv-content';

export type ContentProcessingTask = {
  batchId: string;
  accountId: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};

export type ValidateCsvContentRequest = ContentProcessingTask;
export type ValidateCsvContentResponse = {
  batchId: string;
  accountId: string;
  rows: BulkSubmissionCsvRow[];
};

export type BulkSubmission = api.BulkSubmission;
