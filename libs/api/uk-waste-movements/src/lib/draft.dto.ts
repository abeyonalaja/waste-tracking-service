import { Response } from '@wts/util/invocation';
import { ValidationResult } from './validation';

export type Method = Readonly<{
  name: string;
}>;

export interface AccountIdRequest {
  accountId: string;
}
export interface IdRequest {
  id: string;
}

export type WasteSource = 'Household' | 'Commercial';
export type WasteTransport =
  | 'Road'
  | 'Rail'
  | 'Sea'
  | 'Air'
  | 'InlandWaterways';
export type PhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Sludge'
  | 'Powder'
  | 'Mixed';

export interface HazardousWasteCode {
  code: string;
  name: string;
}

export interface Pop {
  name: string;
  concentration: number;
  concentrationUnit: string;
}

export interface ChemicalAndBiologicalComponent {
  name: string;
  concentration: number;
  concentrationUnit: string;
}

export type QuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';

export type WasteQuantityType = 'EstimateData' | 'ActualData';

export interface Address {
  buildingNameOrNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode?: string;
  country: string;
}

export interface Contact {
  organisationName: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProducerDetail {
  reference: string;
  sicCode?: string;
  contact: Contact;
  address: Address;
}

export interface ExpectedWasteCollectionDate {
  day: string;
  month: string;
  year: string;
}

export interface WasteCollectionDetail {
  wasteSource: string;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  localAuthority: string;
  expectedWasteCollectionDate: ExpectedWasteCollectionDate;
  address: WasteCollectionAddress;
}

export interface CarrierDetail {
  contact: Contact;
  address: Address;
}

export interface WasteCollectionAddress {
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  postcode?: string;
  country?: string;
}

export interface ReceiverDetail {
  authorizationType: string;
  environmentalPermitNumber?: string;
  contact: Contact;
  address: Address;
}

export interface WasteTransportationDetail {
  numberAndTypeOfContainers: string;
  specialHandlingRequirements?: string;
}

export interface WasteTypeDetail {
  ewcCode: string;
  wasteDescription: string;
  physicalForm: PhysicalForm;
  wasteQuantity: number;
  quantityUnit: QuantityUnit;
  wasteQuantityType: WasteQuantityType;
  chemicalAndBiologicalComponents: ChemicalAndBiologicalComponent[];
  hasHazardousProperties: boolean;
  containsPops: boolean;
  hazardousWasteCodes?: HazardousWasteCode[];
  pops?: Pop[];
}

export interface Declaration {
  declarationTimestamp: Date;
  transactionId: string;
}

export interface SimpleDraft {
  id: string;
  producer: ProducerDetail;
  wasteCollection: WasteCollectionDetail;
  carrier: CarrierDetail;
  receiver: ReceiverDetail;
  wasteTransportation: WasteTransportationDetail;
  wasteTypes: WasteTypeDetail[];
  declaration: Declaration;
  state: DraftState;
}

export type DraftFlattened = ProducerDetailFlattened &
  WasteCollectionDetailFlattened &
  ReceiverDetailFlattened &
  WasteTransportationDetailFlattened &
  WasteTypeDetailFlattened &
  CarrierDetailFlattened;

export interface ProducerDetailFlattened {
  producerOrganisationName: string;
  producerContactName: string;
  producerContactEmail: string;
  producerContactPhone: string;
  producerAddressLine1: string;
  producerAddressLine2?: string;
  producerTownCity: string;
  producerPostcode?: string;
  producerCountry: string;
  producerSicCode?: string;
  customerReference: string;
}

export interface ReceiverDetailFlattened {
  receiverAuthorizationType: string;
  receiverEnvironmentalPermitNumber?: string;
  receiverOrganisationName: string;
  receiverAddressLine1: string;
  receiverAddressLine2?: string;
  receiverTownCity: string;
  receiverPostcode?: string;
  receiverCountry: string;
  receiverContactName: string;
  receiverContactPhone: string;
  receiverContactEmail: string;
}

export interface WasteTransportationDetailFlattened {
  wasteTransportationNumberAndTypeOfContainers: string;
  wasteTransportationSpecialHandlingRequirements?: string;
}

export interface WasteCollectionDetailFlattened {
  wasteCollectionAddressLine1?: string;
  wasteCollectionAddressLine2?: string;
  wasteCollectionTownCity?: string;
  wasteCollectionPostcode?: string;
  wasteCollectionCountry?: string;
  wasteCollectionLocalAuthority: string;
  wasteCollectionWasteSource: string;
  wasteCollectionBrokerRegistrationNumber?: string;
  wasteCollectionCarrierRegistrationNumber?: string;
  wasteCollectionExpectedWasteCollectionDate: string;
}

export interface CarrierDetailFlattened {
  carrierOrganisationName?: string;
  carrierAddressLine1?: string;
  carrierAddressLine2?: string;
  carrierTownCity?: string;
  carrierCountry?: string;
  carrierPostcode?: string;
  carrierContactName?: string;
  carrierContactEmail?: string;
  carrierContactPhone?: string;
}

export interface WasteTypeDetailFlattened {
  firstWasteTypeEwcCode: string;
  firstWasteTypeWasteDescription: string;
  firstWasteTypePhysicalForm: string;
  firstWasteTypeWasteQuantity: string;
  firstWasteTypeWasteQuantityUnit: string;
  firstWasteTypeWasteQuantityType: string;
  firstWasteTypeChemicalAndBiologicalComponentsString: string;
  firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: string;
  firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString: string;
  firstWasteTypeHasHazardousProperties: string;
  firstWasteTypeHazardousWasteCodesString?: string;
  firstWasteTypeContainsPops: string;
  firstWasteTypePopsString?: string;
  firstWasteTypePopsConcentrationsString?: string;
  firstWasteTypePopsConcentrationUnitsString?: string;
  secondWasteTypeEwcCode?: string;
  secondWasteTypeWasteDescription?: string;
  secondWasteTypePhysicalForm?: string;
  secondWasteTypeWasteQuantity?: string;
  secondWasteTypeWasteQuantityUnit?: string;
  secondWasteTypeWasteQuantityType?: string;
  secondWasteTypeChemicalAndBiologicalComponentsString?: string;
  secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  secondWasteTypeHasHazardousProperties?: string;
  secondWasteTypeHazardousWasteCodesString?: string;
  secondWasteTypeContainsPops?: string;
  secondWasteTypePopsString?: string;
  secondWasteTypePopsConcentrationsString?: string;
  secondWasteTypePopsConcentrationUnitsString?: string;
  thirdWasteTypeEwcCode?: string;
  thirdWasteTypeWasteDescription?: string;
  thirdWasteTypePhysicalForm?: string;
  thirdWasteTypeWasteQuantity?: string;
  thirdWasteTypeWasteQuantityUnit?: string;
  thirdWasteTypeWasteQuantityType?: string;
  thirdWasteTypeChemicalAndBiologicalComponentsString?: string;
  thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  thirdWasteTypeHasHazardousProperties?: string;
  thirdWasteTypeHazardousWasteCodesString?: string;
  thirdWasteTypeContainsPops?: string;
  thirdWasteTypePopsString?: string;
  thirdWasteTypePopsConcentrationsString?: string;
  thirdWasteTypePopsConcentrationUnitsString?: string;
  fourthWasteTypeEwcCode?: string;
  fourthWasteTypeWasteDescription?: string;
  fourthWasteTypePhysicalForm?: string;
  fourthWasteTypeWasteQuantity?: string;
  fourthWasteTypeWasteQuantityUnit?: string;
  fourthWasteTypeWasteQuantityType?: string;
  fourthWasteTypeChemicalAndBiologicalComponentsString?: string;
  fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  fourthWasteTypeHasHazardousProperties?: string;
  fourthWasteTypeHazardousWasteCodesString?: string;
  fourthWasteTypeContainsPops?: string;
  fourthWasteTypePopsString?: string;
  fourthWasteTypePopsConcentrationsString?: string;
  fourthWasteTypePopsConcentrationUnitsString?: string;
  fifthWasteTypeEwcCode?: string;
  fifthWasteTypeWasteDescription?: string;
  fifthWasteTypePhysicalForm?: string;
  fifthWasteTypeWasteQuantity?: string;
  fifthWasteTypeWasteQuantityUnit?: string;
  fifthWasteTypeWasteQuantityType?: string;
  fifthWasteTypeChemicalAndBiologicalComponentsString?: string;
  fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  fifthWasteTypeHasHazardousProperties?: string;
  fifthWasteTypeHazardousWasteCodesString?: string;
  fifthWasteTypeContainsPops?: string;
  fifthWasteTypePopsString?: string;
  fifthWasteTypePopsConcentrationsString?: string;
  fifthWasteTypePopsConcentrationUnitsString?: string;
  sixthWasteTypeEwcCode?: string;
  sixthWasteTypeWasteDescription?: string;
  sixthWasteTypePhysicalForm?: string;
  sixthWasteTypeWasteQuantity?: string;
  sixthWasteTypeWasteQuantityUnit?: string;
  sixthWasteTypeWasteQuantityType?: string;
  sixthWasteTypeChemicalAndBiologicalComponentsString?: string;
  sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  sixthWasteTypeHasHazardousProperties?: string;
  sixthWasteTypeHazardousWasteCodesString?: string;
  sixthWasteTypeContainsPops?: string;
  sixthWasteTypePopsString?: string;
  sixthWasteTypePopsConcentrationsString?: string;
  sixthWasteTypePopsConcentrationUnitsString?: string;
  seventhWasteTypeEwcCode?: string;
  seventhWasteTypeWasteDescription?: string;
  seventhWasteTypePhysicalForm?: string;
  seventhWasteTypeWasteQuantity?: string;
  seventhWasteTypeWasteQuantityUnit?: string;
  seventhWasteTypeWasteQuantityType?: string;
  seventhWasteTypeChemicalAndBiologicalComponentsString?: string;
  seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  seventhWasteTypeHasHazardousProperties?: string;
  seventhWasteTypeHazardousWasteCodesString?: string;
  seventhWasteTypeContainsPops?: string;
  seventhWasteTypePopsString?: string;
  seventhWasteTypePopsConcentrationsString?: string;
  seventhWasteTypePopsConcentrationUnitsString?: string;
  eighthWasteTypeEwcCode?: string;
  eighthWasteTypeWasteDescription?: string;
  eighthWasteTypePhysicalForm?: string;
  eighthWasteTypeWasteQuantity?: string;
  eighthWasteTypeWasteQuantityUnit?: string;
  eighthWasteTypeWasteQuantityType?: string;
  eighthWasteTypeChemicalAndBiologicalComponentsString?: string;
  eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  eighthWasteTypeHasHazardousProperties?: string;
  eighthWasteTypeHazardousWasteCodesString?: string;
  eighthWasteTypeContainsPops?: string;
  eighthWasteTypePopsString?: string;
  eighthWasteTypePopsConcentrationsString?: string;
  eighthWasteTypePopsConcentrationUnitsString?: string;
  ninthWasteTypeEwcCode?: string;
  ninthWasteTypeWasteDescription?: string;
  ninthWasteTypePhysicalForm?: string;
  ninthWasteTypeWasteQuantity?: string;
  ninthWasteTypeWasteQuantityUnit?: string;
  ninthWasteTypeWasteQuantityType?: string;
  ninthWasteTypeChemicalAndBiologicalComponentsString?: string;
  ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  ninthWasteTypeHasHazardousProperties?: string;
  ninthWasteTypeHazardousWasteCodesString?: string;
  ninthWasteTypeContainsPops?: string;
  ninthWasteTypePopsString?: string;
  ninthWasteTypePopsConcentrationsString?: string;
  ninthWasteTypePopsConcentrationUnitsString?: string;
  tenthWasteTypeEwcCode?: string;
  tenthWasteTypeWasteDescription?: string;
  tenthWasteTypePhysicalForm?: string;
  tenthWasteTypeWasteQuantity?: string;
  tenthWasteTypeWasteQuantityUnit?: string;
  tenthWasteTypeWasteQuantityType?: string;
  tenthWasteTypeChemicalAndBiologicalComponentsString?: string;
  tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
  tenthWasteTypeHasHazardousProperties?: string;
  tenthWasteTypeHazardousWasteCodesString?: string;
  tenthWasteTypeContainsPops?: string;
  tenthWasteTypePopsString?: string;
  tenthWasteTypePopsConcentrationsString?: string;
  tenthWasteTypePopsConcentrationUnitsString?: string;
}

export type DraftReceiverDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: ReceiverDetail;
    };

type DraftAddress =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<Address>)
  | ({ status: 'Complete' } & Address);

type DraftContact =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<Contact>)
  | ({ status: 'Complete' } & Contact);

export interface DraftProducer {
  reference: string;
  sicCode?: string;
  contact: DraftContact;
  address: DraftAddress;
}

export type DraftWasteCollection =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<WasteCollectionDetail>)
  | ({ status: 'Complete' } & WasteCollectionDetail);

export type ProducerAndWasteCollectionDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<{
      producer: DraftProducer;
      wasteCollection: DraftWasteCollection;
    }>)
  | {
      status: 'Complete';
      producer: DraftProducer;
      wasteCollection: DraftWasteCollection;
    };

export type WasteInformation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      wasteTypes: WasteTypeDetail[];
      wasteTransportation: WasteTransportationDetail;
    };

export type DraftDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      value: Declaration;
    };

export type DraftCarrierDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: CarrierDetail;
    };

export type DraftStateStatus =
  | 'InProgress'
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals';

export interface DraftState {
  status: DraftStateStatus;
  timestamp: Date;
}

export interface Draft {
  id: string;
  wasteInformation: WasteInformation;
  receiver: DraftReceiverDetail;
  producerAndCollection: ProducerAndWasteCollectionDetail;
  carrier: DraftCarrierDetail;
  declaration: DraftDeclaration;
  state: DraftState;
}

export type GetDraftRequest = AccountIdRequest & IdRequest;
export type GetDraftResponse = Response<Draft>;
export const getDraft: Method = {
  name: 'getDraft',
};

export interface GetDraftsDto {
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

export interface GetDraftsResult {
  totalRecords: number;
  totalPages: number;
  page: number;
  values: GetDraftsDto[];
}

export interface GetDraftsRequest {
  page: number;
  pageSize?: number;
  collectionDate?: Date;
  ewcCode?: string;
  producerName?: string;
  wasteMovementId?: string;
}

export type GetDraftsResponse = Response<GetDraftsResult>;

export const getDrafts: Method = {
  name: 'getDrafts',
};

export type ValidateMultipleDraftsRequest = AccountIdRequest & {
  padIndex: number;
  values: DraftFlattened[];
};

export type ValidateMultipleDraftsResponse = Response<ValidationResult>;
export const validateMultipleDrafts: Method = {
  name: 'validateMultipleDrafts',
};

export type PartialSimpleDraft = Omit<
  SimpleDraft & { transactionId?: string },
  'id' | 'declaration' | 'state'
> & {
  id?: string;
};

export type CreateMultipleDraftsRequest = AccountIdRequest & {
  values: PartialSimpleDraft[];
};

export type CreateMultipleDraftsResponse = Response<void>;

export const createMultipleDrafts: Method = {
  name: 'createMultipleDrafts',
};

export type DbContainerNameKey = 'drafts';

export type CreateDraftRequest = AccountIdRequest &
  Pick<DraftProducer, 'reference'>;
export type CreateDraftResponse = Response<Draft>;
export const createDraft: Method = {
  name: 'createDraft',
};

export type SetDraftProducerAddressDetailsRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Address> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Address } & { saveAsDraft: false });

export type SetDraftProducerAddressDetailsResponse = Response<void>;

export const setDraftProducerAddressDetails: Method = {
  name: 'setDraftProducerAddressDetails',
};

export type GetDraftProducerAddressDetailsRequest = IdRequest &
  AccountIdRequest;
export type GetDraftProducerAddressDetailsResponse =
  | Response<DraftAddress>
  | undefined;
export const getDraftProducerAddressDetails: Method = {
  name: 'getDraftProducerAddressDetails',
};
