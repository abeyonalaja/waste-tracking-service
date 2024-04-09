export * as submissionSchema from './submission.schema';
export type { DraftSubmission, Submission } from './submission.dto';
export type {
  WasteSource,
  WasteTransport,
  PhysicalForm,
  Quantityunits,
  DraftSubmissionState,
  DraftSubmissionConfirmation,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
  ProducerDetails,
  Address,
  Contact,
} from './submission.dto';

export type { Field } from './validation';

export { validateSubmissions } from './submission.dto';
export * as validation from './validation';
