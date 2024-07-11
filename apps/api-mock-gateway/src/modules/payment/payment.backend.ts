import { db } from '../../db';
import {
  CreatedPayment,
  PaymentDetail,
  PaymentRecord,
  PaymentReference,
} from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../lib/errors';

export interface PaymentRef {
  id: string;
  accountId: string;
}

export enum DateAmountType {
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}

function generateRandomAlphaNumericString(length: number): string {
  let s = '';
  Array.from({ length }).some(() => {
    s += Math.random().toString(36).slice(2);
    return s.length >= length;
  });
  return s.slice(0, length).toUpperCase();
}

function addDate(dt: Date, amount: number, dateType: DateAmountType): Date {
  switch (dateType) {
    case DateAmountType.DAYS:
      return (dt.setDate(dt.getDate() + amount) && dt) as Date;
    case DateAmountType.WEEKS:
      return (dt.setDate(dt.getDate() + 7 * amount) && dt) as Date;
    case DateAmountType.MONTHS:
      return (dt.setMonth(dt.getMonth() + amount) && dt) as Date;
    case DateAmountType.YEARS:
      return (dt.setFullYear(dt.getFullYear() + amount) && dt) as Date;
  }
}

function calculateRenewalDate(startDate?: string): string {
  let dt = !startDate ? new Date() : new Date(startDate);
  dt = addDate(addDate(dt, 1, DateAmountType.YEARS), -1, DateAmountType.DAYS);
  dt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000);
  return dt.toISOString().split('T')[0];
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomResponse(
  amount: number,
  description: string,
  reference: string,
  paymentId: string,
): Omit<PaymentRecord, 'id'> {
  let dt = new Date();
  dt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000);

  const response: Omit<PaymentRecord, 'id'> = {
    amount,
    description,
    reference,
    paymentId,
    state: {
      status: 'Success',
      capturedDate: dt.toISOString().split('T')[0],
    },
  };

  switch (randomIntFromInterval(1, 10)) {
    case 1:
      response.state = {
        status: 'InProgress',
      };
      break;
    case 2:
      response.state = {
        status: 'Rejected',
        code: 'P0010',
      };
      break;
    case 3:
      response.state = {
        status: 'CancelledByUser',
        code: 'P0030',
      };
      break;
    case 4:
      response.state = {
        status: 'Error',
        code: 'P0050',
      };
      break;
    default:
      response;
      break;
  }

  return response;
}

export async function createPayment(
  accountId: PaymentRef['accountId'],
  value: PaymentDetail,
): Promise<CreatedPayment> {
  const id = uuidv4();
  const paymentId = generateRandomAlphaNumericString(26).toLowerCase(); // or reuse id?

  const response: Omit<CreatedPayment, 'id'> = {
    amount: !value.amount ? 2000 : value.amount,
    description: !value.description
      ? 'Annual waste tracking service charge'
      : value.description,
    reference: generateRandomAlphaNumericString(10),
    paymentId: paymentId,
    createdDate: new Date().toJSON(),
    returnUrl: value.returnUrl,
    redirectUrl: {
      href: value.returnUrl,
      method: 'GET',
    },
    cancelUrl: {
      href: `http://localhost:3000/api/payments/${paymentId}/cancel`,
      method: 'POST',
    },
  };

  const record: CreatedPayment = {
    id,
    ...response,
  };

  db.paymentDrafts.push({ ...record, accountId });

  return Promise.resolve(record);
}

export async function setPayment({
  id,
  accountId,
}: PaymentRef): Promise<PaymentRecord> {
  const draftPayment = db.paymentDrafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (draftPayment === undefined) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  const response = generateRandomResponse(
    draftPayment.amount,
    draftPayment.description,
    draftPayment.reference,
    draftPayment.paymentId,
  );
  const value: PaymentRecord = {
    id,
    ...response,
  };
  if (response.state.status === 'Success') {
    let startDate = '';
    const existingPayments = db.payments
      .filter((s) => s.accountId == accountId)
      .sort((x, y) => {
        return (x.expiryDate as string) > (y.expiryDate as string) ? 1 : -1;
      })
      .reverse();
    if (
      existingPayments.length > 0 &&
      new Date(existingPayments[0].expiryDate as string) >= new Date()
    ) {
      startDate = existingPayments[0].expiryDate as string;
    }

    value.expiryDate = calculateRenewalDate(
      !startDate ? response.state.capturedDate : startDate,
    );

    db.payments.push({ ...value, accountId });

    const index = db.paymentDrafts.findIndex((d) => {
      return d.id === draftPayment.id;
    });

    db.paymentDrafts.splice(index, 1);
  } else {
    if (response.state.status !== 'InProgress') {
      const index = db.paymentDrafts.findIndex((d) => {
        return d.id === draftPayment.id;
      });

      db.paymentDrafts.splice(index, 1);
    }
  }

  return Promise.resolve(value);
}

export async function getPayment(
  accountId: PaymentRef['accountId'],
): Promise<PaymentReference> {
  let startDate = '';
  let serviceChargePaid = false;
  const existingPayments = db.payments
    .filter((s) => s.accountId == accountId)
    .sort((x, y) => {
      return (x.expiryDate as string) > (y.expiryDate as string) ? 1 : -1;
    })
    .reverse();
  if (
    existingPayments.length > 0 &&
    new Date(existingPayments[0].expiryDate as string) >= new Date()
  ) {
    serviceChargePaid = true;
    startDate = existingPayments[0].expiryDate as string;
  }

  return Promise.resolve({
    serviceChargePaid,
    expiryDate: startDate,
    renewalDate: calculateRenewalDate(startDate),
  });
}

// Added to mock Gov.UK Pay cancel by service scenario
export async function cancelPayment(
  paymentId: string,
  accountId: PaymentRef['accountId'],
): Promise<void> {
  const draftPayment = db.paymentDrafts.find(
    (s) => s.paymentId == paymentId && s.accountId == accountId,
  );
  if (draftPayment === undefined) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  return Promise.resolve();
}
