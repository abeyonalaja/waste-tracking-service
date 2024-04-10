import { AccountIdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { ValidationResult } from './validation';

export type WasteSource =
  | 'Household'
  | 'Commercial'
  | 'Construction'
  | 'Industrial'
  | 'Local Authority'
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
export type Quantityunits = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';

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

export type ProducerDetails = {
  reference: string;
  sicCode: string;
  contact: Contact;
  address: Address;
};

export type WasteCollectionDetails = {
  wasteSource: WasteSource;
  brokerRegistrationNumber: string;
  carrierRegistrationNumber: string;
  transportMethod: WasteTransport;
  exceptedWasteCollectionDate: Date;
  contact: Contact;
  address: Address;
};

export type ReceiverDetails = {
  authorizationType: string;
  environmentalPermitNumber: string;
  contact: Contact;
  address: Address;
};

export type WasteTransportation = {
  numberTypeContainer: string;
  specialHandlingRequirements: string;
};

export type WasteTypeDetails = {
  ewcCode: string;
  wasteDescription: string;
  physicalForm: PhysicalForm;
  wasteQuantity: number;
  quantityUnits: Quantityunits;
  wasteQuantityType: WasteQuantityType;
  haveHazardousProperties: boolean;
  containsPop: boolean;
  hazardousPropertiesCode?: string;
  popDetails?: string;
};

export type SubmissionBase = {
  transactionId: string;
  producer: ProducerDetails;
  wasteCollectionDetails: WasteCollectionDetails;
  receiver: ReceiverDetails;
  wasteTransportation: WasteTransportation;
  wasteTypeDetails: WasteTypeDetails[];
  submissionState: SubmissionState;
};

export type Submission = SubmissionBase & {
  submissionConfirmation: SubmissionConfirmation;
};

export type ProducerDetailsFlattened = {
  producerOrganisationName: string;
  producerContactName: string;
  producerEmail: string;
  producerPhone: string;
  producerAddressLine1: string;
  producerAddressLine2?: string;
  producerTownCity: string;
  producerPostcode: string;
  producerCountry: string;
  producerSicCode: string;
  reference: string;
};

export type ReceiverDetailsFlattened = {
  receiverAuthorizationType: string;
  receiverEnvironmentalPermitNumber: string;
  receiverOrganisationName: string;
  receiverAddressLine1: string;
  receiverAddressLine2?: string;
  receiverTownCity: string;
  receiverPostcode: string;
  receiverCountry: string;
  receiverContactName: string;
  receiverContactPhone: string;
  receiverContactEmail: string;
};

export type SubmissionFlattened = ProducerDetailsFlattened &
  ReceiverDetailsFlattened;

export type ValidateSubmissionsRequest = AccountIdRequest & {
  values: SubmissionFlattened[];
};

export type ValidateSubmissionsResponse = Response<ValidationResult>;
export const validateSubmissions: Method = {
  name: 'validateSubmissions',
  httpVerb: 'POST',
};
