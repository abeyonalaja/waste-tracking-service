import * as api from '@wts/api/uk-waste-movements';
import * as bulkApi from '@wts/api/uk-waste-movements-bulk';

export { validation } from '@wts/api/uk-waste-movements';

export type Submission = api.Submission;
export type DraftSubmission = api.DraftSubmission;
export type ProducerDetails = api.ProducerDetails;

export type FieldFormatError = api.validation.FieldFormatError;
export type InvalidAttributeCombinationError =
  api.validation.InvalidAttributeCombinationError;
export type ValidationResult = api.validation.ValidationResult;
export type Value = api.validation.Value;
export type Error = api.validation.Error;

export type CustomerReference = Submission['reference'];

export type SubmissionFlattened = bulkApi.SubmissionFlattened;
export type ProducerDetailsFlattened = bulkApi.ProducerDetailsFlattened;
