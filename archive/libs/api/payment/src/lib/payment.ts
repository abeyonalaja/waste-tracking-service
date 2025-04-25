import { Response } from '@wts/util/invocation';

type Method = Readonly<{
  name: string;
}>;

export type DbContainerNameKey = 'drafts' | 'service-charges';

interface IdRequest {
  id: string;
}

interface AccountIdRequest {
  accountId: string;
}

export interface CreatedPayment {
  id: string;
  amount: number;
  description: string;
  reference: string;
  paymentId: string;
  createdDate: string;
  returnUrl: string;
  redirectUrl: string;
}

export type CreatePaymentRequest = AccountIdRequest & {
  returnUrl: string;
  description?: string;
  amount?: number;
};
export type CreatePaymentResponse = Response<{
  id: CreatedPayment['id'];
  redirectUrl: CreatedPayment['redirectUrl'];
}>;

export const PaymentStateDict: { [key: string]: string } = {
  P0010: 'Rejected',
  P0020: 'SessionExpired',
  P0030: 'CancelledByUser',
  P0040: 'CancelledByService',
  P0050: 'Error',
};

export type PaymentFailureStatus =
  | 'Rejected'
  | 'SessionExpired'
  | 'CancelledByUser'
  | 'CancelledByService'
  | 'Error';

export type PaymentStatusErrorCode =
  | 'P0010'
  | 'P0020'
  | 'P0030'
  | 'P0040'
  | 'P0050';

export type PaymentState =
  | {
      status: 'InProgress';
    }
  | {
      status: 'Success';
      capturedDate: string;
    }
  | {
      status: PaymentFailureStatus;
      code: PaymentStatusErrorCode;
    };

export interface PaymentRecord {
  id: string;
  amount: number;
  description: string;
  reference: string;
  paymentId: string;
  state: PaymentState;
  expiryDate?: string;
}

export type SetPaymentRequest = IdRequest & AccountIdRequest;
export type SetPaymentResponse = Response<Omit<PaymentRecord, 'paymentId'>>;

export interface PaymentReference {
  serviceChargePaid: boolean;
  expiryDate: string;
  renewalDate: string;
}

export type GetPaymentRequest = AccountIdRequest;
export type GetPaymentResponse = Response<PaymentReference>;

export type CancelPaymentRequest = IdRequest & AccountIdRequest;
export type CancelPaymentResponse = Response<void>;

export const createPayment: Method = {
  name: 'createPayment',
};

export const setPayment: Method = {
  name: 'setPayment',
};

export const getPayment: Method = {
  name: 'getPayment',
};

export const cancelPayment: Method = {
  name: 'cancelPayment',
};
