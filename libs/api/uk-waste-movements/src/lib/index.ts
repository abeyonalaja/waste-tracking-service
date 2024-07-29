export * as draftSchema from './draft.schema';
export type {} from './submission.dto';

export type {
  DraftReceiverDetail,
  Declaration,
  Draft,
  WasteInformation,
  ProducerAndWasteCollectionDetail,
  GetDraftRequest,
  GetDraftResponse,
  DraftCarrierDetail,
  GetDraftsRequest,
  GetDraftsResponse,
  GetDraftsResult,
  GetDraftsDto,
  ReceiverDetail,
  WasteSource,
  WasteTransport,
  PhysicalForm,
  QuantityUnit,
  DraftState,
  ValidateMultipleDraftsRequest,
  ValidateMultipleDraftsResponse,
  ProducerDetail,
  WasteCollectionDetail,
  Address,
  Contact,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
  WasteQuantityType,
  CreateMultipleDraftsRequest,
  CreateMultipleDraftsResponse,
  DbContainerNameKey,
  CarrierDetail,
  DraftDeclaration,
  SimpleDraft,
  CreateDraftRequest,
  CreateDraftResponse,
} from './draft.dto';

export type { Field, ErrorCodeData } from './validation';

export {
  getDraft,
  getDrafts,
  createMultipleDrafts,
  validateMultipleDrafts,
  createDraft,
} from './draft.dto';

export * as validation from './validation';
