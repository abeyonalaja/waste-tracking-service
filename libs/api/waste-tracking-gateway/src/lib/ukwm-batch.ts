import { UkwmSubmission } from './ukwm';

export type UkwmPartialSubmission = Omit<
  UkwmSubmission,
  'id' | 'submissionConfirmation' | 'transactionId' | 'submissionState'
>;

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
  wasteMovementId: string;
  producerName: string;
  ewcCode: string;
  collectionDate: {
    day: string;
    month: string;
    year: string;
  };
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
