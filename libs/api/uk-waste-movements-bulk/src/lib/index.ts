export { addContentToBatch, getBatch, finalizeBatch } from './dto';
export type {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  BulkSubmission,
  BulkSubmissionState,
  FinalizeBatchRequest,
  FinalizeBatchResponse,
  PartialSubmission,
  BulkSubmissionValidationRowError,
  BulkSubmissionValidationColumnError,
  BulkSubmissionValidationRowErrorDetails,
  ProducerDetailFlattened,
  WasteCollectionDetailFlattened,
  SubmissionFlattened,
  ReceiverDetailFlattened,
  WasteTransportationDetailFlattened,
  WasteTypeDetailFlattened,
} from './dto';

export * as schema from './schema';
