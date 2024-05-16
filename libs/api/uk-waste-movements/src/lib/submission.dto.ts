import { AccountIdRequest, IdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { ValidationResult } from './validation';
import { DraftSubmission } from './draft.dto';

export type WasteSource =
  | 'Household'
  | 'Commercial'
  | 'Construction'
  | 'Industrial'
  | 'LocalAuthority'
  | 'Demolition';
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

export type HazardousWasteCode = {
  code: string;
  name: string;
};

export type Pop = {
  name: string;
  concentration: number;
  concentrationUnit: string;
};

export type ChemicalAndBiologicalComponent = {
  name: string;
  concentration: number;
  concentrationUnit: string;
};

export type QuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';

export type SubmissionStateStatus =
  | 'SubmittedWithEstimates'
  | 'SubmittedWithActuals'
  | 'UpdatedWithActuals';

export type SubmissionState = {
  status: SubmissionStateStatus;
  timestamp: Date;
};

export type SubmissionConfirmation =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      confirmation: boolean;
    };

export type WasteQuantityType = 'EstimateData' | 'ActualData';

export type Address = {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode?: string;
  country: string;
};

export type Contact = {
  organisationName: string;
  name: string;
  email: string;
  phone: string;
};

export type ProducerDetail = {
  reference: string;
  sicCode?: string;
  contact: Contact;
  address: Address;
};

export type ExpectedWasteCollectionDate = {
  day: string;
  month: string;
  year: string;
};

export type WasteCollectionDetail = {
  wasteSource: string;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  modeOfWasteTransport: string;
  expectedWasteCollectionDate: ExpectedWasteCollectionDate;
  address: WasteCollectionAddress;
};

export type WasteCollectionAddress = {
  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  postcode?: string;
  country?: string;
};

export type ReceiverDetail = {
  authorizationType: string;
  environmentalPermitNumber?: string;
  contact: Contact;
  address: Address;
};

export type WasteTransportationDetail = {
  numberAndTypeOfContainers: string;
  specialHandlingRequirements?: string;
};

export type WasteTypeDetail = {
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
};

export type SubmissionDeclaration = {
  declarationTimestamp: Date;
  transactionId: string;
};

export type Submission = {
  id: string;
  producer: ProducerDetail;
  wasteCollection: WasteCollectionDetail;
  receiver: ReceiverDetail;
  wasteTransportation: WasteTransportationDetail;
  wasteTypes: WasteTypeDetail[];
  submissionDeclaration: SubmissionDeclaration;
  submissionState: SubmissionState;
};

export type ProducerDetailFlattened = {
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
};

export type ReceiverDetailFlattened = {
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
};

export type WasteTransportationDetailFlattened = {
  wasteTransportationNumberAndTypeOfContainers: string;
  wasteTransportationSpecialHandlingRequirements?: string;
};

export type WasteCollectionDetailFlattened = {
  wasteCollectionAddressLine1?: string;
  wasteCollectionAddressLine2?: string;
  wasteCollectionTownCity?: string;
  wasteCollectionPostcode?: string;
  wasteCollectionCountry?: string;
  wasteCollectionWasteSource: string;
  wasteCollectionBrokerRegistrationNumber?: string;
  wasteCollectionCarrierRegistrationNumber?: string;
  wasteCollectionModeOfWasteTransport: string;
  wasteCollectionExpectedWasteCollectionDate: string;
};

export type WasteTypeDetailFlattened = {
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
};

export type SubmissionFlattened = ProducerDetailFlattened &
  WasteCollectionDetailFlattened &
  ReceiverDetailFlattened &
  WasteTransportationDetailFlattened &
  WasteTypeDetailFlattened;

export type ValidateSubmissionsRequest = AccountIdRequest & {
  padIndex: number;
  values: SubmissionFlattened[];
};

export type ValidateSubmissionsResponse = Response<ValidationResult>;
export const validateSubmissions: Method = {
  name: 'validateSubmissions',
  httpVerb: 'POST',
};

export type PartialSubmission = Omit<
  Submission,
  'id' | 'submissionDeclaration' | 'submissionState'
>;

export type CreateSubmissionsRequest = IdRequest &
  AccountIdRequest & {
    values: PartialSubmission[];
  };
export type CreateSubmissionsResponse = Response<DraftSubmission[]>;

export const createSubmissions: Method = {
  name: 'createSubmissions',
  httpVerb: 'POST',
};

export const getDraft: Method = {
  name: 'getDraft',
  httpVerb: 'POST',
};

export type DbContainerNameKey = 'drafts';
