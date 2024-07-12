import * as api from '@wts/api/payment';

export type DbContainerNameKey = api.DbContainerNameKey;
export type CreatedPayment = api.CreatedPayment;
export type PaymentFailureStatus = api.PaymentFailureStatus;
export const PaymentStateDict = api.PaymentStateDict;
export type PaymentStatusErrorCode = api.PaymentStatusErrorCode;
export type PaymentState = api.PaymentState;
export type PaymentRecord = api.PaymentRecord;

export type CreatePaymentRequest = api.CreatePaymentRequest;
export type CreatePaymentResponse = api.CreatePaymentResponse;

export type SetPaymentRequest = api.SetPaymentRequest;
export type SetPaymentResponse = api.SetPaymentResponse;

export type GetPaymentRequest = api.GetPaymentRequest;
export type GetPaymentResponse = api.GetPaymentResponse;

export type CancelPaymentRequest = api.CancelPaymentRequest;
export type CancelPaymentResponse = api.CancelPaymentResponse;
