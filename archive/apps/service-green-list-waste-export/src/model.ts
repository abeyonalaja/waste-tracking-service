import * as api from '@wts/api/green-list-waste-export';
import * as bulkApi from '@wts/api/green-list-waste-export-bulk';

export type Submission = api.submission.Submission;
export type SubmissionSummary = api.submission.SubmissionSummary;

export type CustomerReference = Submission['reference'];
export type WasteDescription = Submission['wasteDescription'];
export type WasteCodeComponent = WasteDescription['wasteCode'];
export type EwcCodeComponent = WasteDescription['ewcCodes'];
export type NationalCodeComponent = WasteDescription['nationalCode'];
export type WasteQuantity = Submission['wasteQuantity'];
export type ExporterDetail = Submission['exporterDetail'];
export type ImporterDetail = Submission['importerDetail'];
export type CollectionDate = Submission['collectionDate'];
export type Carriers = Submission['carriers'];
export type CollectionDetail = Submission['collectionDetail'];
export type UkExitLocation = Submission['ukExitLocation'];
export type TransitCountries = Submission['transitCountries'];
export type RecoveryFacilityDetails = Submission['recoveryFacilityDetail'];

export type Carrier = api.submission.Carrier;
export type RecoveryFacilityDetail = api.submission.RecoveryFacilityDetail;
export type PartialSubmission = api.submission.PartialSubmission;
export type WasteQuantityData = api.submission.WasteQuantityData;

export type SubmissionState = api.submission.SubmissionState;

export type DbContainerNameKey = api.common.DbContainerNameKey;
export type RecordStateStatus = api.common.RecordStateStatus;
export type RecordState = api.common.RecordState;
export type RecordSummaryPage<T> = api.common.RecordSummaryPage<T>;
export type PageMetadata = api.common.PageMetadata;

export type DraftSubmission = api.draft.DraftSubmission;
export type DraftSubmissionSummary = api.draft.DraftSubmissionSummary;

export type DraftWasteDescription = DraftSubmission['wasteDescription'];
export type DraftWasteQuantity = DraftSubmission['wasteQuantity'];
export type DraftExporterDetail = DraftSubmission['exporterDetail'];
export type DraftImporterDetail = DraftSubmission['importerDetail'];
export type DraftCollectionDate = DraftSubmission['collectionDate'];
export type DraftCarriers = DraftSubmission['carriers'];
export type DraftCollectionDetail = DraftSubmission['collectionDetail'];
export type DraftUkExitLocation = DraftSubmission['ukExitLocation'];
export type DraftTransitCountries = DraftSubmission['transitCountries'];
export type DraftRecoveryFacilityDetails =
  DraftSubmission['recoveryFacilityDetail'];

export type DraftCarrier = api.draft.DraftCarrier;
export type DraftCarrierPartial = api.draft.DraftCarrierPartial;
export type DraftRecoveryFacility = api.draft.DraftRecoveryFacility;
export type DraftRecoveryFacilityPartial =
  api.draft.DraftRecoveryFacilityPartial;

export type SubmissionBase = { id: string } & Omit<
  DraftSubmission,
  | 'reference'
  | 'wasteQuantity'
  | 'collectionDate'
  | 'submissionConfirmation'
  | 'submissionDeclaration'
  | 'submissionState'
>;

export type Template = api.template.Template;
export type TemplateSummary = api.template.TemplateSummary;

export type NumberOfSubmissions = api.submission.NumberOfSubmissions;

export type FieldFormatError = api.validation.FieldFormatError;
export type InvalidAttributeCombinationError =
  api.validation.InvalidAttributeCombinationError;
export type ValidationResult = api.validation.ValidationResult;
export type Value = api.validation.Value;
export type Error = api.validation.Error;

export type SubmissionFlattened = bulkApi.SubmissionFlattened;
export type CustomerReferenceFlattened = bulkApi.CustomerReferenceFlattened;
export type WasteCodeSubSectionFlattened = bulkApi.WasteCodeSubSectionFlattened;
export type WasteDescriptionSubSectionFlattened =
  bulkApi.WasteDescriptionSubSectionFlattened;
export type WasteDescriptionFlattened = bulkApi.WasteDescriptionFlattened;
export type WasteQuantityFlattened = bulkApi.WasteQuantityFlattened;
export type ExporterDetailFlattened = bulkApi.ExporterDetailFlattened;
export type ImporterDetailFlattened = bulkApi.ImporterDetailFlattened;
export type CollectionDateFlattened = bulkApi.CollectionDateFlattened;
export type CarriersFlattened = bulkApi.CarriersFlattened;
export type CollectionDetailFlattened = bulkApi.CollectionDetailFlattened;
export type ExitLocationFlattened = bulkApi.ExitLocationFlattened;
export type TransitCountriesFlattened = bulkApi.TransitCountriesFlattened;
export type RecoveryFacilityDetailFlattened =
  bulkApi.RecoveryFacilityDetailFlattened;
