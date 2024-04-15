export type UkwmPhysicalForm =
  | 'Gas'
  | 'Liquid'
  | 'Solid'
  | 'Sludge'
  | 'Powder'
  | 'Mixed';
export type UkwmQuantityUnits = 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
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

export type UkwmProducerDetails = {
  reference: string;
  sicCode: string;
  contact: UkwmContact;
  address: UkwmAddress;
};

export type UkwmReceiverDetails = {
  authorizationType: string;
  environmentalPermitNumber: string;
  contact: UkwmContact;
  address: UkwmAddress;
};

export type UkwmWasteTypeDetails = {
  ewcCode: string;
  wasteDescription: string;
  physicalForm: UkwmPhysicalForm;
  wasteQuantity: number;
  quantityUnits: UkwmQuantityUnits;
  wasteQuantityType: UkwmWasteQuantityType;
  haveHazardousProperties: boolean;
  containsPop: boolean;
  hazardousPropertiesCode?: string;
  popDetails?: string;
};

export type UkwmPartialSubmission = {
  producer: UkwmProducerDetails;
  wasteTypeDetails: UkwmWasteTypeDetails;
  receiver: UkwmReceiverDetails;
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
