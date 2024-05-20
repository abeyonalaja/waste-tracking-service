import { LocalAuthority, Pop, WasteCode } from '@wts/api/reference-data';
import * as api from '@wts/api/uk-waste-movements';
import * as bulkApi from '@wts/api/uk-waste-movements-bulk';

export { validation } from '@wts/api/uk-waste-movements';

export type Submission = api.Submission;
export type DraftSubmission = api.DraftSubmission;
export type ProducerDetail = api.ProducerDetail;
export type ReceiverDetail = api.ReceiverDetail;
export type WasteTransportationDetail = api.WasteTransportationDetail;
export type WasteTypeDetail = api.WasteTypeDetail;
export type WasteQuantityType = api.WasteQuantityType;
export type QuantityUnit = api.QuantityUnit;
export type PhysicalForm = api.PhysicalForm;
export type DbContainerNameKey = api.DbContainerNameKey;
export type GetDraftsResult = api.GetDraftsResult;
export type GetDraftsDto = api.GetDraftsDto;
export type GetDraftsRequest = api.GetDraftsRequest;

export type FieldFormatError = api.validation.FieldFormatError;
export type InvalidAttributeCombinationError =
  api.validation.InvalidAttributeCombinationError;
export type ValidationResult = api.validation.ValidationResult;
export type Value = api.validation.Value;
export type Error = api.validation.Error;
export type WasteTypeErrorCode = api.validation.errorCodes.WasteTypeErrorCode;

export type SubmissionFlattened = bulkApi.SubmissionFlattened;
export type ProducerDetailFlattened = bulkApi.ProducerDetailFlattened;
export type WasteCollectionDetail = api.WasteCollectionDetail;
export type WasteCollectionDetailFlattened =
  bulkApi.WasteCollectionDetailFlattened;
export type CarrierDetail = api.CarrierDetail;
export type CarrierDetailFlattened = bulkApi.CarrierDetailFlattened;
export type ReceiverDetailFlattened = bulkApi.ReceiverDetailFlattened;
export type WasteTransportationDetailFlattened =
  bulkApi.WasteTransportationDetailFlattened;
export type WasteTypeDetailFlattened = bulkApi.WasteTypeDetailFlattened;

export type SubmissionValidationReferenceData = {
  hazardousCodes: WasteCode[];
  pops: Pop[];
  ewcCodes: WasteCode[];
  localAuthorities: LocalAuthority[];
};
