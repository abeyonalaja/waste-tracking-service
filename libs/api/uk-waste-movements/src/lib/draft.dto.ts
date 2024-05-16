import { IdRequest } from '@wts/api/common';
import {
  ProducerDetail,
  ReceiverDetail,
  WasteCollectionDetail,
  WasteTransportationDetail,
  WasteTypeDetail,
  SubmissionDeclaration,
  SubmissionState,
} from './submission.dto';
import { Response } from '@wts/util/invocation';

type DraftStatus<T> =
  | { status: 'NotStarted' }
  | ({ status: 'InProgress' } & T)
  | ({ status: 'Completed' } & T);

export type DraftReceiverDetail = DraftStatus<ReceiverDetail>;
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

export type DraftSubmission = {
  id: string;
  transactionId: string;
  wasteInformation: WasteInformation;
  receiver: DraftReceiverDetail;
  producerAndCollection: ProducerAndWasteCollectionDetail;
  submissionDeclaration: DraftSubmissionDeclaration;
  submissionState: SubmissionState;
};

export type GetDraftRequest = IdRequest;
export type GetDraftResponse = Response<DraftSubmission>;
