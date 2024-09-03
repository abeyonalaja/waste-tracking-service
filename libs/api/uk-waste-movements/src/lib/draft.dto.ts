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
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  faxNumber?: string;
}

export interface ProducerDetail {
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
  address: Address;
}

export interface CarrierDetail {
  contact: Contact;
  address: Address;
}

export interface ReceiverDetail {
  permitDetails: PermitDetails;
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
  reference: string;
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

export interface PermitDetails {
  authorizationType: string;
  environmentalPermitNumber?: string;
}

export type DraftPermitDetails =
  | {
      status: 'NotStarted';
    }
  | ({
      status: 'Started';
    } & Partial<PermitDetails>)
  | ({ status: 'Complete' } & PermitDetails);

export interface DraftReceiver {
  permitDetails: DraftPermitDetails;
  contact: DraftContact;
  address: DraftAddress;
}

export type DraftAddress =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<Address>)
  | ({ status: 'Complete' } & Address);

export type DraftContact =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<Contact>)
  | ({ status: 'Complete' } & Contact);

export type DraftWasteSource =
  | { status: 'NotStarted' }
  | ({ status: 'Complete' } & { value: string });

export interface DraftSicCodes {
  status: 'NotStarted' | 'Complete';
  values: string[];
}

export type DraftModeOfTransport =
  | { status: 'NotStarted' }
  | ({ status: 'Complete' } & { value: WasteTransport });

export interface DraftProducer {
  sicCodes: DraftSicCodes;
  contact: DraftContact;
  address: DraftAddress;
}

export interface DraftWasteCollection {
  wasteSource: DraftWasteSource;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  localAuthority?: string;
  expectedWasteCollectionDate?: ExpectedWasteCollectionDate;
  address: DraftAddress;
}

export interface ProducerAndWasteCollectionDetail {
  producer: DraftProducer;
  wasteCollection: DraftWasteCollection;
  confirmation: DraftSectionConfirmation;
}

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

export interface DraftCarrier {
  contact: DraftContact;
  address: DraftAddress;
  modeOfTransport: DraftModeOfTransport;
}

export type DraftStateStatus =
  | 'InProgress'
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals';

export interface DraftState {
  status: DraftStateStatus;
  timestamp: Date;
}

export interface DraftSectionConfirmation {
  status: 'NotStarted' | 'InProgress' | 'Complete';
}

export interface Draft {
  id: string;
  reference: string;
  wasteInformation: WasteInformation;
  receiver: DraftReceiver;
  producerAndCollection: ProducerAndWasteCollectionDetail;
  carrier: DraftCarrier;
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

export type CreateDraftRequest = AccountIdRequest & Pick<Draft, 'reference'>;
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

export type GetDraftProducerContactDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftProducerContactDetailResponse = Response<DraftContact>;
export const getDraftProducerContactDetail: Method = {
  name: 'getDraftProducerContactDetail',
};

export type SetDraftProducerContactDetailRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Contact> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Contact } & { saveAsDraft: false });

export type SetDraftProducerContactDetailResponse = Response<void>;
export const setDraftProducerContactDetail: Method = {
  name: 'setDraftProducerContactDetail',
};

export type GetDraftWasteSourceRequest = IdRequest & AccountIdRequest;
export type GetDraftWasteSourceResponse = Response<DraftWasteSource>;
export const getDraftWasteSource: Method = {
  name: 'getDraftWasteSource',
};

export type SetDraftWasteSourceRequest = IdRequest &
  AccountIdRequest & { wasteSource: string };
export type SetDraftWasteSourceResponse = Response<void>;
export const setDraftWasteSource: Method = {
  name: 'setDraftWasteSource',
};

export type GetDraftWasteCollectionAddressDetailsRequest = IdRequest &
  AccountIdRequest;
export type GetDraftWasteCollectionAddressDetailsResponse =
  | Response<DraftAddress>
  | undefined;
export const getDraftWasteCollectionAddressDetails: Method = {
  name: 'getDraftWasteCollectionAddressDetails',
};

export type SetDraftWasteCollectionAddressDetailsRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Address> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Address } & { saveAsDraft: false });

export type SetDraftWasteCollectionAddressDetailsResponse = Response<void>;

export const setDraftWasteCollectionAddressDetails: Method = {
  name: 'setDraftWasteCollectionAddressDetails',
};

export type CreateDraftSicCodeRequest = IdRequest &
  AccountIdRequest & { sicCode: string };
export type CreateDraftSicCodeResponse = Response<string>;
export const createDraftSicCode: Method = {
  name: 'createDraftSicCode',
};

export type GetDraftSicCodesRequest = IdRequest & AccountIdRequest;
export type GetDraftSicCodesResponse = Response<DraftSicCodes>;
export const getDraftSicCodes: Method = {
  name: 'getDraftSicCode',
};

export type GetDraftCarrierAddressDetailsRequest = IdRequest & AccountIdRequest;
export type GetDraftCarrierAddressDetailsResponse =
  | Response<DraftAddress>
  | undefined;
export const getDraftCarrierAddressDetails: Method = {
  name: 'getDraftCarrierAddressDetails',
};

export type SetDraftCarrierAddressDetailsRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Address> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Address } & { saveAsDraft: false });

export type SetDraftCarrierAddressDetailsResponse = Response<void>;

export const setDraftCarrierAddressDetails: Method = {
  name: 'setDraftCarrierAddressDetails',
};

export type GetDraftCarrierContactDetailRequest = IdRequest & AccountIdRequest;
export type GetDraftCarrierContactDetailResponse = Response<DraftContact>;
export const getDraftCarrierContactDetail: Method = {
  name: 'getDraftCarrierContactDetail',
};

export type SetDraftCarrierContactDetailRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Contact> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Contact } & { saveAsDraft: false });

export type SetDraftCarrierContactDetailResponse = Response<void>;
export const setDraftCarrierContactDetail: Method = {
  name: 'setDraftCarrierContactDetail',
};

export type GetDraftReceiverAddressDetailsRequest = IdRequest &
  AccountIdRequest;
export type GetDraftReceiverAddressDetailsResponse =
  | Response<DraftAddress>
  | undefined;
export const getDraftReceiverAddressDetails: Method = {
  name: 'getDraftReceiverAddressDetails',
};

export type SetDraftReceiverAddressDetailsRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Address> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Address } & { saveAsDraft: false });

export type SetDraftReceiverAddressDetailsResponse = Response<void>;

export const setDraftReceiverAddressDetails: Method = {
  name: 'setDraftReceiverAddressDetails',
};

export type DeleteDraftSicCodeRequest = IdRequest &
  AccountIdRequest & { code: string };
export type DeleteDraftSicCodeResponse = Response<string[]>;
export const deleteDraftSicCode: Method = {
  name: 'deleteDraftSicCode',
};

export type SetDraftProducerConfirmationRequest = IdRequest &
  AccountIdRequest & {
    isConfirmed: boolean;
  };

export type SetDraftProducerConfirmationResponse = Response<void>;
export const setDraftProducerConfirmation: Method = {
  name: 'setDraftProducerConfirmation',
};

export type SetDraftReceiverContactDetailsRequest =
  | (IdRequest &
      AccountIdRequest & { value: Partial<Contact> } & { saveAsDraft: true })
  | (IdRequest &
      AccountIdRequest & { value: Contact } & { saveAsDraft: false });

export type SetDraftReceiverContactDetailsResponse = Response<void>;
export const setDraftReceiverContactDetail: Method = {
  name: 'setDraftReceiverContactDetail',
};

export type GetDraftReceiverContactDetailsRequest = IdRequest &
  AccountIdRequest;
export type GetDraftReceiverContactDetailsResponse = Response<DraftContact>;
export const getDraftReceiverContactDetail: Method = {
  name: 'getDraftReceiverContactDetail',
};
