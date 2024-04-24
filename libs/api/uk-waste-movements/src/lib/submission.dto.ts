import { AccountIdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { ValidationResult } from './validation';

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
  concentration: number;
  concentrationUnit: 'Microgram' | 'Milligram' | 'Kilogram';
  unIdentificationNumber: string;
  properShippingName: string;
  unClass: string;
  packageGroup: string;
  specialHandlingRequirements: string;
};

export type Pop = {
  name: string;
  concentration: number;
  concentrationUnit: 'Microgram' | 'Milligram' | 'Kilogram';
};

export type QuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';

export type SubmissionState = {
  status: 'InProgress' | 'Submitted';
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
  hasHazardousProperties: boolean;
  containsPops: boolean;
  hazardousWasteCodes?: HazardousWasteCode[];
  pops?: Pop[];
};

export type SubmissionBase = {
  transactionId: string;
  producer: ProducerDetail;
  wasteCollection: WasteCollectionDetail;
  receiver: ReceiverDetail;
  wasteTransportation: WasteTransportationDetail;
  wasteType: WasteTypeDetail[];
  submissionState: SubmissionState;
};

export type Submission = SubmissionBase & {
  submissionConfirmation: SubmissionConfirmation;
};

export type ProducerDetailFlattened = {
  producerOrganisationName: string;
  producerContactName: string;
  producerEmail: string;
  producerPhone: string;
  producerAddressLine1: string;
  producerAddressLine2?: string;
  producerTownCity: string;
  producerPostcode?: string;
  producerCountry: string;
  producerSicCode?: string;
  reference: string;
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
  wasteCollectionDetailsAddressLine1?: string;
  wasteCollectionDetailsAddressLine2?: string;
  wasteCollectionDetailsTownCity?: string;
  wasteCollectionDetailsPostcode?: string;
  wasteCollectionDetailsCountry?: string;
  wasteCollectionDetailsWasteSource: string;
  wasteCollectionDetailsBrokerRegistrationNumber?: string;
  wasteCollectionDetailsCarrierRegistrationNumber?: string;
  wasteCollectionDetailsModeOfWasteTransport: string;
  wasteCollectionDetailsExpectedWasteCollectionDate: string;
};

export type SubmissionFlattened = ProducerDetailFlattened &
  WasteCollectionDetailFlattened &
  ReceiverDetailFlattened &
  WasteTransportationDetailFlattened;

export type ValidateSubmissionsRequest = AccountIdRequest & {
  padIndex: number;
  values: SubmissionFlattened[];
};

export type ValidateSubmissionsResponse = Response<ValidationResult>;
export const validateSubmissions: Method = {
  name: 'validateSubmissions',
  httpVerb: 'POST',
};
