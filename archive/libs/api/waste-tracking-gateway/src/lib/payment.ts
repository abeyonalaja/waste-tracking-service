export interface PaymentDetail {
  returnUrl: string;
  description?: string;
  amount?: number;
}

export interface CreatedPayment {
  id: string;
  redirectUrl: string;
}

export type CreatePaymentRequest = PaymentDetail;
export type CreatePaymentResponse = CreatedPayment;

type PaymentFailureStatus =
  | 'Rejected'
  | 'SessionExpired'
  | 'CancelledByUser'
  | 'CancelledByService'
  | 'Error';

type PaymentStatusErrorCode = 'P0010' | 'P0020' | 'P0030' | 'P0040' | 'P0050';

type PaymentState =
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
  state: PaymentState;
  expiryDate?: string;
}

export type SetPaymentResponse = PaymentRecord;

export interface PaymentReference {
  serviceChargePaid: boolean;
  expiryDate: string;
  renewalDate: string;
}

export type GetPaymentResponse = PaymentReference;

export type CancelPaymentResponse = undefined;
