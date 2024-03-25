import { BulkSubmission as ApiBulkSubmission } from '@wts/api/uk-waste-movements-bulk';

export type BulkSubmission = ApiBulkSubmission;

export type ContentProcessingTask = {
  batchId: string;
  accountId: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};
