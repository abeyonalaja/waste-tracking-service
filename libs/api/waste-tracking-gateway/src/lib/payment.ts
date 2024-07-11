export interface PaymentDetail {
  returnUrl: string;
  description?: string;
  amount?: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Link {
  href: string;
  method: HttpMethod;
}

export interface CreatedPayment {
  id: string;
  amount: number;
  description: string;
  reference: string;
  paymentId: string;
  createdDate: string;
  returnUrl: string;
  redirectUrl: Link;
  cancelUrl: Link;
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
  paymentId: string;
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
