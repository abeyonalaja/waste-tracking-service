export * as submissionSchema from './submission.schema';
export type { Submission, ReceiverDetails } from './submission.dto';
export type {
  WasteSource,
  WasteTransport,
  PhysicalForm,
  QuantityUnits,
  SubmissionState,
  SubmissionConfirmation,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
  ProducerDetails,
  Address,
  Contact,
} from './submission.dto';

export type { Field } from './validation';

export { validateSubmissions } from './submission.dto';
export * as validation from './validation';
