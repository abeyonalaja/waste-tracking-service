export * as submissionSchema from './submission.schema';
export * as draftSchema from './draft.schema';
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
  CarrierDetail,
} from './submission.dto';

export type {
  DraftReceiverDetail,
  DraftSubmissionDeclaration,
  DraftSubmission,
  WasteInformation,
  ProducerAndWasteCollectionDetail,
  GetDraftRequest,
  GetDraftResponse,
  DraftCarrierDetail,
  GetDraftsRequest,
  GetDraftsResponse,
  GetDraftsResult,
  GetDraftsDto,
} from './draft.dto';

export type { Field, ErrorCodeData } from './validation';

export {
  validateSubmissions,
  createSubmissions,
  getDraft,
} from './submission.dto';

export { getDrafts } from './draft.dto';

export * as validation from './validation';
