import * as api from '@wts/api/green-list-waste-export';
import * as bulkApi from '@wts/api/green-list-waste-export-bulk';

export { validation } from '@wts/api/green-list-waste-export';

export type Submission = api.Submission;
export type SubmissionBase = api.SubmissionBase;
export type DraftSubmission = api.DraftSubmission;
export type PartialSubmission = bulkApi.PartialSubmission;
export type PartialSubmissionWithId = bulkApi.PartialSubmissionWithId;
export type DraftWasteDescription = api.DraftWasteDescription;
export type DraftWasteQuantity = api.DraftWasteQuantity;
export type DraftCollectionDate = api.DraftCollectionDate;
export type DraftExporterDetail = api.DraftExporterDetail;
export type DraftImporterDetail = api.DraftImporterDetail;
export type DraftCarriers = api.DraftCarriers;
export type Carrier = api.Carrier;
export type CarrierData = api.CarrierData;
export type DraftCollectionDetail = api.DraftCollectionDetail;
export type DraftExitLocation = api.DraftExitLocation;
export type DraftTransitCountries = api.DraftTransitCountries;
export type RecoveryFacility = api.RecoveryFacility;
export type RecoveryFacilityData = api.RecoveryFacilityData;
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
export type ExporterDetail = Submission['exporterDetail'];
export type ImporterDetail = Submission['importerDetail'];
export type CollectionDate = Submission['collectionDate'];
export type Carriers = Submission['carriers'];
export type CollectionDetail = Submission['collectionDetail'];
export type ExitLocation = Submission['ukExitLocation'];
export type TransitCountries = Submission['transitCountries'];
export type RecoveryFacilityDetail = Submission['recoveryFacilityDetail'];

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
