import * as api from '@wts/api/annex-vii';
import * as bulkApi from '@wts/api/annex-vii-bulk';

export { validation } from '@wts/api/annex-vii';

export type Submission = api.Submission;
export type SubmissionBase = api.SubmissionBase;
export type DraftSubmission = api.DraftSubmission;
export type DraftWasteDescription = api.DraftWasteDescription;
export type DraftWasteQuantity = api.DraftWasteQuantity;
export type DraftCollectionDate = api.DraftCollectionDate;
export type DraftExporterDetail = api.DraftExporterDetail;
export type DraftImporterDetail = api.DraftImporterDetail;
export type DraftCarriers = api.DraftCarriers;
export type Carrier = api.Carrier;
export type DraftCollectionDetail = api.DraftCollectionDetail;
export type DraftExitLocation = api.DraftExitLocation;
export type DraftTransitCountries = api.DraftTransitCountries;
export type RecoveryFacility = api.RecoveryFacility;
export type DraftRecoveryFacilityDetail = api.DraftRecoveryFacilityDetail;
export type DraftSubmissionSummary = api.DraftSubmissionSummary;
export type DraftSubmissionSummaryPage = api.DraftSubmissionSummaryPage;
export type DraftSubmissionPageMetadata = api.DraftSubmissionPageMetadata;
export type Template = api.Template;
export type TemplateSummary = api.TemplateSummary;
export type TemplateSummaryPage = api.TemplateSummaryPage;
export type TemplatePageMetadata = api.TemplatePageMetadata;
export type NumberOfSubmissions = api.NumberOfSubmissions;

export type FieldFormatError = api.validation.FieldFormatError;
export type InvalidAttributeCombinationError =
  api.validation.InvalidAttributeCombinationError;
export type ValidationResult = api.validation.ValidationResult;
export type Value = api.validation.Value;
export type Error = api.validation.Error;

export type CustomerReference = Submission['reference'];
export type WasteDescription = Submission['wasteDescription'];
export type WasteCodeComponent = WasteDescription['wasteCode'];
export type EwcCodeComponent = WasteDescription['ewcCodes'];
export type NationalCodeComponent = WasteDescription['nationalCode'];
export type WasteQuantity = Submission['wasteQuantity'];

export type SubmissionFlattened = bulkApi.SubmissionFlattened;
export type CustomerReferenceFlattened = bulkApi.CustomerReferenceFlattened;
export type WasteDescriptionFlattened = bulkApi.WasteDescriptionFlattened;
export type WasteQuantityFlattened = bulkApi.WasteQuantityFlattened;
