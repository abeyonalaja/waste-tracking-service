import * as api from '@wts/api/uk-waste-movements';
import * as bulkApi from '@wts/api/uk-waste-movements-bulk';

export { validation } from '@wts/api/uk-waste-movements';

export type Submission = api.Submission;
export type ProducerDetail = api.ProducerDetail;
export type ReceiverDetail = api.ReceiverDetail;
export type WasteTransportationDetail = api.WasteTransportationDetail;
export type WasteTypeDetail = api.WasteTypeDetail;
export type WasteQuantityType = api.WasteQuantityType;
export type QuantityUnit = api.QuantityUnit;
export type PhysicalForm = api.PhysicalForm;
export type DbContainerNameKey = api.DbContainerNameKey;

export type FieldFormatError = api.validation.FieldFormatError;
export type InvalidAttributeCombinationError =
  api.validation.InvalidAttributeCombinationError;
export type ValidationResult = api.validation.ValidationResult;
export type Value = api.validation.Value;
export type Error = api.validation.Error;
export type WasteTypeErrorMessage = api.validation.WasteTypeErrorMessage;

export type SubmissionFlattened = bulkApi.SubmissionFlattened;
export type ProducerDetailFlattened = bulkApi.ProducerDetailFlattened;
export type WasteCollectionDetail = api.WasteCollectionDetail;
export type WasteCollectionDetailFlattened =
  bulkApi.WasteCollectionDetailFlattened;
export type ReceiverDetailFlattened = bulkApi.ReceiverDetailFlattened;
export type WasteTransportationDetailFlattened =
  bulkApi.WasteTransportationDetailFlattened;
export type WasteTypeDetailFlattened = bulkApi.WasteTypeDetailFlattened;
