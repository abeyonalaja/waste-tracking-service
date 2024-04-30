export {
  getSubmissions,
  getSubmission,
  getWasteQuantity,
  setWasteQuantity,
  getCollectionDate,
  setCollectionDate,
  cancelSubmission,
  getNumberOfSubmissions,
  createSubmissions,
  getBulkSubmissions,
} from './dto';

export type {
  Carrier,
  CollectionDate,
  CollectionDetail,
  ExporterDetail,
  ImporterDetail,
  RecoveryFacilityDetail,
  PartialSubmission,
  Submission,
  SubmissionDeclaration,
  SubmissionState,
  SubmissionSummary,
  TransitCountry,
  UkExitLocation,
  WasteDescription,
  WasteQuantity,
  GetSubmissionsResponse,
  GetSubmissionRequest,
  GetSubmissionResponse,
  GetWasteQuantityRequest,
  GetWasteQuantityResponse,
  SetWasteQuantityRequest,
  SetWasteQuantityResponse,
  GetCollectionDateRequest,
  GetCollectionDateResponse,
  SetCollectionDateRequest,
  SetCollectionDateResponse,
  CancelSubmissionRequest,
  CancelSubmissionResponse,
  NumberOfSubmissions,
  GetNumberOfSubmissionsRequest,
  GetNumberOfSubmissionsResponse,
  CreateSubmissionsRequest,
  CreateSubmissionsResponse,
  GetBulkSubmissionsRequest,
  GetBulkSubmissionsResponse,
} from './dto';

export { validateSubmissions } from './dto-flattened';

export type {
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
} from './dto-flattened';

export * as schema from './schema';
export * as schemaFlattened from './schema-flattened';
