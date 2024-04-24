export type UkwmPhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Sludge'
  | 'Powder'
  | 'Mixed';

export type UkwmQuantityUnit = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
export type UkwmWasteQuantityType = 'EstimateData' | 'ActualData';

export type UkwmAddress = {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode: string;
  country: string;
};

export type UkwmContact = {
  organisationName: string;
  name: string;
  email: string;
  phone: string;
};

export type UkwmProducerDetail = {
  reference: string;
  sicCode: string;
  contact: UkwmContact;
  address: UkwmAddress;
};

export type UkwmReceiverDetail = {
  authorizationType: string;
  environmentalPermitNumber: string;
  contact: UkwmContact;
  address: UkwmAddress;
};

export type UkwmHazardousWasteCode = {
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

export type UkwmPop = {
  name: string;
  concentration: number;
  concentrationUnit: 'Microgram' | 'Milligram' | 'Kilogram';
};

export type UkwmWasteTypeDetail = {
  ewcCode: string;
  wasteDescription: string;
  physicalForm: UkwmPhysicalForm;
  wasteQuantity: number;
  quantityUnit: UkwmQuantityUnit;
  wasteQuantityType: UkwmWasteQuantityType;
  hasHazardousProperties: boolean;
  containsPops: boolean;
  hazardousWasteCodes?: UkwmHazardousWasteCode[];
  pops?: UkwmPop[];
};

export type UkwmExpectedWasteCollectionDate = {
  day: string;
  month: string;
  year: string;
};

export type UkwmWasteCollectionDetail = {
  wasteSource: string;
  brokerRegistrationNumber?: string;
  carrierRegistrationNumber?: string;
  modeOfWasteTransport: string;
  expectedWasteCollectionDate: UkwmExpectedWasteCollectionDate;
  address: UkwmAddress;
};

export type UkwmWasteTransportationDetail = {
  numberAndTypeOfContainers: string;
  specialHandlingRequirements?: string;
};

export type UkwmPartialSubmission = {
  producer: UkwmProducerDetail;
  wasteType: UkwmWasteTypeDetail;
  receiver: UkwmReceiverDetail;
  wasteCollection: UkwmWasteCollectionDetail;
  wasteTransportation: UkwmWasteTransportationDetail;
};

export type UkwmBulkSubmissionValidationRowError = {
  rowNumber: number;
  errorAmount: number;
  errorDetails: string[];
};

export type UkwmBulkSubmissionValidationRowErrorDetails = {
  rowNumber: number;
  errorReason: string;
};

export type UkwmBulkSubmissionValidationColumnError = {
  errorAmount: number;
  columnName: string;
  errorDetails: UkwmBulkSubmissionValidationRowErrorDetails[];
};

export type UkwmSubmissionReference = {
  id: string;
  transactionId: string;
  reference: string;
};

export type UkwmBulkSubmissionState =
  | {
      status: 'Processing';
      timestamp: Date;
    }
  | {
      status: 'FailedCsvValidation';
      timestamp: Date;
      error: string;
    }
  | {
      status: 'FailedValidation';
      timestamp: Date;
      rowErrors: UkwmBulkSubmissionValidationRowError[];
      columnErrors: UkwmBulkSubmissionValidationColumnError[];
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
      submissions: UkwmPartialSubmission[];
    }
  | {
      status: 'Submitting';
      timestamp: Date;
      hasEstimates: boolean;
      submissions: UkwmPartialSubmission[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      transactionId: string;
      submissions: UkwmSubmissionReference[];
    };

export type UkwmBulkSubmission = {
  id: string;
  state: UkwmBulkSubmissionState;
};

export type GetUwkwmBulkSubmissionResponse = UkwmBulkSubmission;
