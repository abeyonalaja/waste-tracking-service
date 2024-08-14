export type UkwmPhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Sludge'
  | 'Powder'
  | 'Mixed';

export type UkwmQuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
export type UkwmWasteQuantityType = 'EstimateData' | 'ActualData';
export type UkwmWasteTransport =
  | 'Road'
  | 'Rail'
  | 'Sea'
  | 'Air'
  | 'InlandWaterways';

export interface UkwmAccountIdRequest {
  accountId: string;
}
export interface UkwmIdRequest {
  id: string;
}

export interface UkwmAddress {
  buildingNameOrNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode?: string;
  country: string;
}

export interface UkwmContact {
  organisationName: string;
  name: string;
  email: string;
  phone: string;
  fax?: string;
}

export interface UkwmWasteCollectionAddress {
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  postcode?: string;
  country?: string;
}

export interface UkwmProducerDetail {
  reference: string;
  sicCode?: string;
  contact: UkwmContact;
  address: UkwmAddress;
}

export interface UkwmReceiverDetail {
  authorizationType: string;
  environmentalPermitNumber?: string;
  contact: UkwmContact;
  address: UkwmAddress;
}

export interface UkwmCarrierDetail {
  contact: UkwmContact;
  address: UkwmAddress;
}

export interface UkwmHazardousWasteCode {
  code: string;
  name: string;
}

export interface UkwmPop {
  name: string;
  concentration: number;
  concentrationUnit: string;
}

export interface UkwmChemicalAndBiologicalComponent {
  name: string;
  concentration: number;
  concentrationUnit: string;
}

export interface UkwmWasteTypeDetail {
  ewcCode: string;
  wasteDescription: string;
  physicalForm: UkwmPhysicalForm;
  wasteQuantity: number;
  quantityUnit: UkwmQuantityUnit;
  wasteQuantityType: UkwmWasteQuantityType;
  chemicalAndBiologicalComponents: UkwmChemicalAndBiologicalComponent[];
  hasHazardousProperties: boolean;
  containsPops: boolean;
  hazardousWasteCodes?: UkwmHazardousWasteCode[];
  pops?: UkwmPop[];
}

export interface UkwmExpectedWasteCollectionDate {
  day: string;
  month: string;
  year: string;
}

export interface UkwmWasteCollectionDetail {
  wasteSource: string;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  localAuthority: string;
  expectedWasteCollectionDate: UkwmExpectedWasteCollectionDate;
  address: UkwmWasteCollectionAddress;
}

export interface UkwmWasteTransportationDetail {
  numberAndTypeOfContainers: string;
  specialHandlingRequirements?: string;
}

export interface UkwmSubmission {
  id: string;
  transactionId: string;
  producer: UkwmProducerDetail;
  wasteCollection: UkwmWasteCollectionDetail;
  receiver: UkwmReceiverDetail;
  wasteTransportation: UkwmWasteTransportationDetail;
  wasteTypes: UkwmWasteTypeDetail[];
  submissionState: UkwmSubmissionState;
}

export interface UkwmGetDraftsDto {
  id: string;
  wasteMovementId: string;
  producerName: string;
  ewcCode: string;
  collectionDate: {
    day: string;
    month: string;
    year: string;
  };
}

export interface UkwmGetDraftsRequest {
  page: number;
  pageSize?: number;
  collectionDate?: Date;
  ewcCode?: string;
  producerName?: string;
  wasteMovementId?: string;
}

export interface UkwmGetDraftsResult {
  totalRecords: number;
  totalPages: number;
  page: number;
  values: UkwmGetDraftsDto[];
}

export type UkwmWasteInformation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      wasteTypes: UkwmWasteTypeDetail[];
      wasteTransportation: UkwmWasteTransportationDetail;
    };

export type UkwmDraftReceiverDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: UkwmReceiverDetail;
    };

export type UkwmDraftAddress =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<UkwmAddress>)
  | ({ status: 'Complete' } & UkwmAddress);

export type UkwmDraftContact =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<UkwmContact>)
  | ({ status: 'Complete' } & UkwmContact);

export interface UkwmDraftSicCodes {
  status: 'NotStarted' | 'Complete';
  values: string[];
}

export type UkwmDraftModeOfTransport =
  | { status: 'NotStarted' }
  | ({ status: 'Complete' } & { value: UkwmWasteTransport });

export interface UkwmDraftProducer {
  reference: string;
  sicCodes: UkwmDraftSicCodes;
  contact: UkwmDraftContact;
  address: UkwmDraftAddress;
}

export type UkwmDraftWasteSource =
  | { status: 'NotStarted' }
  | ({ status: 'Complete' } & { value: string });

export interface UkwmDraftWasteCollection {
  wasteSource: UkwmDraftWasteSource;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  localAuthority?: string;
  expectedWasteCollectionDate?: UkwmExpectedWasteCollectionDate;
  address: UkwmDraftAddress;
}

export type UkwmProducerAndWasteCollectionDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<{
      producer: UkwmDraftProducer;
      wasteCollection: UkwmDraftWasteCollection;
    }>)
  | {
      status: 'Complete';
      producer: UkwmDraftProducer;
      wasteCollection: UkwmDraftWasteCollection;
    };

export interface UkwmSubmissionDeclaration {
  declarationTimestamp: Date;
  transactionId: string;
}

export type UkwmDraftSubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      value: UkwmSubmissionDeclaration;
    };

export type UkwmSubmissionStateStatus =
  | 'InProgress'
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals';

export interface UkwmSubmissionState {
  status: UkwmSubmissionStateStatus;
  timestamp: Date;
}

export interface UkwmDraft {
  id: string;
  wasteInformation: UkwmWasteInformation;
  receiver: UkwmDraftReceiverDetail;
  producerAndCollection: UkwmProducerAndWasteCollectionDetail;
  carrier: UkwmDraftCarrier;
  declaration: UkwmDraftSubmissionDeclaration;
  state: UkwmSubmissionState;
}

export interface UkwmDraftCarrier {
  contact: UkwmDraftContact;
  address: UkwmDraftAddress;
  modeOfTransport: UkwmDraftModeOfTransport;
}

export type GetUkwmSubmissionResponse = UkwmDraft;

export type UkwmCreateDraftRequest = Pick<UkwmDraftProducer, 'reference'>;
export type UkwmCreateDraftResponse = UkwmDraft;

export type UkwmGetDraftProducerAddressDetailsResponse = UkwmDraftAddress;

export type UkwmSetDraftProducerAddressDetailsRequest = UkwmAddress;

export type UkwmGetDraftProducerContactDetailResponse =
  | UkwmDraftContact
  | undefined;

export type UkwmSetDraftProducerContactDetailRequest = UkwmContact;

export type UkwmGetDraftWasteSourceResponse = UkwmDraftWasteSource;

export interface UkwmSetDraftWasteSourceRequest {
  wasteSource: string;
}

export type UkwmGetDraftWasteCollectionAddressDetailsResponse =
  UkwmDraftAddress;

export type UkwmSetDraftWasteCollectionAddressDetailsRequest = UkwmAddress;

export interface UkwmCreateDraftSicCodeRequest {
  sicCode: string;
}

export type UkwmCreateDraftSicCodeResponse = string;

export type UkwmGetDraftSicCodesResponse = UkwmDraftSicCodes;
