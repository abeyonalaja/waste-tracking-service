import { SectionSummary } from '@wts/api/common';
import { SubmissionBase, WasteDescription } from './submissionBase';

export type CustomerReference = string;

export type CollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: {
        type: 'EstimateDate' | 'ActualDate';
        estimateDate: {
          day?: string;
          month?: string;
          year?: string;
        };
        actualDate: {
          day?: string;
          month?: string;
          year?: string;
        };
      };
    };

export type WasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        estimateData?: {
          quantityType?: 'Volume' | 'Weight';
          value?: number;
        };
        actualData?: {
          quantityType?: 'Volume' | 'Weight';
          value?: number;
        };
      };
    }
  | {
      status: 'Complete';
      value:
        | {
            type: 'NotApplicable';
          }
        | {
            type: 'EstimateData' | 'ActualData';
            estimateData: {
              quantityType?: 'Volume' | 'Weight';
              value?: number;
            };
            actualData: {
              quantityType?: 'Volume' | 'Weight';
              value?: number;
            };
          };
    };

export type SubmissionConfirmation =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      confirmation: boolean;
    };

export type SubmissionDeclarationData = {
  declarationTimestamp: Date;
  transactionId: string;
};

export type SubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: SubmissionDeclarationData;
    };

export type SubmissionCancellationType =
  | {
      type: 'ChangeOfRecoveryFacilityOrLaboratory';
    }
  | {
      type: 'NoLongerExportingWaste';
    }
  | {
      type: 'Other';
      reason: string;
    };

export type SubmissionState =
  | {
      status:
        | 'InProgress'
        | 'Deleted'
        | 'SubmittedWithEstimates'
        | 'SubmittedWithActuals'
        | 'UpdatedWithActuals';
      timestamp: Date;
    }
  | {
      status: 'Cancelled';
      timestamp: Date;
      cancellationType: SubmissionCancellationType;
    };

export interface Submission extends SubmissionBase {
  reference: CustomerReference;
  wasteQuantity: WasteQuantity;
  collectionDate: CollectionDate;
  submissionConfirmation: SubmissionConfirmation;
  submissionDeclaration: SubmissionDeclaration;
  submissionState: SubmissionState;
}

export type SubmissionSummary = Readonly<{
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescription;
  wasteQuantity: SectionSummary;
  exporterDetail: SectionSummary;
  importerDetail: SectionSummary;
  collectionDate: CollectionDate;
  carriers: SectionSummary;
  collectionDetail: SectionSummary;
  ukExitLocation: SectionSummary;
  transitCountries: SectionSummary;
  recoveryFacilityDetail: SectionSummary;
  submissionConfirmation: SectionSummary;
  submissionDeclaration: SubmissionDeclaration;
  submissionState: SubmissionState;
}>;

export type SubmissionPageMetadata = {
  pageNumber: number;
  token: string;
};

export type SubmissionSummaryPage = {
  totalSubmissions: number;
  totalPages: number;
  currentPage: number;
  pages: SubmissionPageMetadata[];
  values: ReadonlyArray<SubmissionSummary>;
};

export type GetSubmissionsResponse = SubmissionSummaryPage;

export type GetSubmissionResponse = Submission;
export type CreateSubmissionRequest = Pick<Submission, 'reference'>;
export type CreateSubmissionResponse = Submission;

export type PutReferenceRequest = CustomerReference;
export type PutReferenceResponse = CustomerReference;
export type GetReferenceResponse = CustomerReference;

export type PutWasteQuantityRequest = WasteQuantity;
export type PutWasteQuantityResponse = WasteQuantity;
export type GetWasteQuantityResponse = WasteQuantity;
export type PutCollectionDateRequest = CollectionDate;
export type PutCollectionDateResponse = CollectionDate;
export type GetCollectionDateResponse = CollectionDate;

export type PutSubmissionConfirmationRequest = SubmissionConfirmation;
export type PutSubmissionConfirmationResponse = SubmissionConfirmation;
export type GetSubmissionConfirmationResponse = SubmissionConfirmation;
export type PutSubmissionDeclarationRequest = Omit<
  SubmissionDeclaration,
  'values'
>;
export type PutSubmissionDeclarationResponse = SubmissionDeclaration;
export type GetSubmissionDeclarationResponse = SubmissionDeclaration;
export type PutSubmissionCancellationRequest = SubmissionCancellationType;
export type PutSubmissionCancellationReponse = SubmissionCancellationType;
