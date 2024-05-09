export * as submissionSchema from './submission.schema';
export type {
  Submission,
  ReceiverDetail,
  WasteSource,
  WasteTransport,
  PhysicalForm,
  QuantityUnit,
  SubmissionState,
  SubmissionConfirmation,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
  ProducerDetail,
  WasteCollectionDetail,
  Address,
  Contact,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
  WasteQuantityType,
  CreateSubmissionsRequest,
  CreateSubmissionsResponse,
  DbContainerNameKey,
} from './submission.dto';

export type { Field } from './validation';

export { validateSubmissions, createSubmissions } from './submission.dto';
export * as validation from './validation';
