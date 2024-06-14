import { Response } from '@wts/util/invocation';
import {
  ProducerDetail,
  ReceiverDetail,
  WasteCollectionDetail,
  WasteTransportationDetail,
  WasteTypeDetail,
  SubmissionDeclaration,
  SubmissionState,
  CarrierDetail,
  IdRequest,
  Method,
} from './submission.dto';

export type DraftReceiverDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: ReceiverDetail;
    };

export type ProducerAndWasteCollectionDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      producer: ProducerDetail;
      wasteCollection: WasteCollectionDetail;
    };

export type WasteInformation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      wasteTypes: WasteTypeDetail[];
      wasteTransportation: WasteTransportationDetail;
    };

export type DraftSubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: SubmissionDeclaration;
    };

export type DraftCarrierDetail =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: CarrierDetail;
    };

export interface DraftSubmission {
  id: string;
  transactionId: string;
  wasteInformation: WasteInformation;
  receiver: DraftReceiverDetail;
  producerAndCollection: ProducerAndWasteCollectionDetail;
  carrier: DraftCarrierDetail;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: SubmissionState;
}

export type GetDraftRequest = IdRequest;
export type GetDraftResponse = Response<DraftSubmission>;

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
