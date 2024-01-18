export type BulkSubmissionValidationError = {
  rowNumber: number;
  errorAmount: number;
  errorDescriptions: string[];
};

export type SubmissionInBulk = {
  id: string;
};

export type SubmissionReference = {
  id: string;
  transactionNumber: string;
};

export type BulkSubmissionState =
  | {
      status: 'Processing';
      timestamp: Date;
    }
  | {
      status: 'FailedValidation';
      timestamp: Date;
      errors: BulkSubmissionValidationError[];
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      drafts: SubmissionInBulk[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      submissions: SubmissionReference[];
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};

export type GetBulkSubmissionResponse = BulkSubmission;
