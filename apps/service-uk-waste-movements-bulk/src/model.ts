import * as api from '@wts/api/uk-waste-movements-bulk';
import { BulkSubmissionCsvRow } from './lib/csv-content';
import { Response } from '@wts/util/invocation';

export type ContentProcessingTask = {
  batchId: string;
  accountId: string;
  content: {
    type: 'text/csv';
    compression: 'Snappy' | 'None';
    value: string;
  };
};

export type ContentToBeProcessedTask = {
  id: string;
  time: string;
  type: string;
  source: string;
  specversion: string;
  datacontenttype: string;
  pubsubname: string;
  queue: string;
  traceparent: string;
  tracestate: string;
  data: ContentProcessingTask;
};

export type ContentSubmissionTask = {
  batchId: string;
  accountId: string;
};

export type ContentToBeSubmittedTask = {
  id: string;
  time: string;
  type: string;
  source: string;
  specversion: string;
  datacontenttype: string;
  pubsubname: string;
  queue: string;
  traceparent: string;
  tracestate: string;
  data: ContentSubmissionTask;
};

export type ValidateCsvContentRequest = api.AddContentToBatchRequest;
export type ValidateCsvContentResponse = Response<{
  batchId: string | undefined;
  accountId: string;
  rows: BulkSubmissionCsvRow[];
}>;

export type BulkSubmission = api.BulkSubmission;
