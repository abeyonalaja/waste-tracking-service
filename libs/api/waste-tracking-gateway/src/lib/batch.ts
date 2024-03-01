export type BulkSubmissionValidationRowError = {
  rowNumber: number;
  errorAmount: number;
  errorDetails: string[];
};

export type BulkSubmissionValidationRowErrorDetails = {
  rowNumber: number;
  errorReason: string;
};

export type BulkSubmissionValidationColumnError = {
  errorAmount: number;
  columnName: string;
  errorDetails: BulkSubmissionValidationRowErrorDetails[];
};

type EwcCode = { code: string };

type WasteDescription = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'OECD' | 'AnnexIIIA' | 'AnnexIIIB';
        code: string;
      };
  ewcCodes: EwcCode[];
  nationalCode?: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

type WasteQuantity =
  | {
      type: 'NotApplicable';
    }
  | {
      type: 'EstimateData' | 'ActualData';
      estimateData: {
        quantityType?: 'Volume' | 'Weight';
        unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
        value?: number;
      };
      actualData: {
        quantityType?: 'Volume' | 'Weight';
        unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
        value?: number;
      };
    };

export type PartialSubmission = {
  reference: string;
  wasteDescription: WasteDescription;
  wasteQuantity: WasteQuantity;
};

export type SubmissionReference = {
  id: string;
  transactionId: string;
};

export type BulkSubmissionState =
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
      rowErrors: BulkSubmissionValidationRowError[];
      columnErrors: BulkSubmissionValidationColumnError[];
    }
  | {
      status: 'PassedValidation';
      timestamp: Date;
      hasEstimates: boolean;
      submissions: PartialSubmission[];
    }
  | {
      status: 'Submitted';
      timestamp: Date;
      transactionId: string;
      submissions: SubmissionReference[];
    };

export type BulkSubmission = {
  id: string;
  state: BulkSubmissionState;
};

export type GetBulkSubmissionResponse = BulkSubmission;
