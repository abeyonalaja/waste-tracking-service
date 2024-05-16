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

export type {
  DraftReceiverDetail,
  DraftSubmissionDeclaration,
  DraftSubmission,
  WasteInformation,
  ProducerAndWasteCollectionDetail,
  GetDraftRequest,
  GetDraftResponse,
} from './draft.dto';

export type { Field, ErrorCodeData } from './validation';

export {
  validateSubmissions,
  createSubmissions,
  getDraft,
} from './submission.dto';
export * as validation from './validation';
