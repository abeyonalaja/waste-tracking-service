import Boom from '@hapi/boom';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { ServiceChargeClient } from '../clients/service-charge-client';
import CosmosServiceChargeRepository from '../data/cosmos-repository';
import { v4 as uuidv4 } from 'uuid';
import {
  CancelPaymentRequest,
  CancelPaymentResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  DbContainerNameKey,
  GetPaymentRequest,
  GetPaymentResponse,
  PaymentRecord,
  SetPaymentRequest,
  SetPaymentResponse,
} from '../model';

type Handler<Request, Response> = (request: Request) => Promise<Response>;

export enum DateAmountType {
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}

export default class ServiceChargeController {
  constructor(
    private serviceChargeClient: ServiceChargeClient,
    private repository: CosmosServiceChargeRepository,
    private logger: Logger,
  ) {}

  readonly draftContainerName: DbContainerNameKey = 'drafts';
  readonly serviceChargeContainerName: DbContainerNameKey = 'service-charges';

  generateRandomAlphaNumericString(length: number): string {
    let s = '';
    Array.from({ length }).some(() => {
      s += Math.random().toString(36).slice(2);
      return s.length >= length;
    });
    return s.slice(0, length).toUpperCase();
  }

  private addDate(dt: Date, amount: number, dateType: DateAmountType): Date {
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

  calculateRenewalDate(startDate?: string): string {
    let dt = !startDate ? new Date() : new Date(startDate);
    dt = this.addDate(
      this.addDate(dt, 1, DateAmountType.YEARS),
      -1,
      DateAmountType.DAYS,
    );
    dt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000);
    return dt.toISOString().split('T')[0];
  }

  createPayment: Handler<CreatePaymentRequest, CreatePaymentResponse> = async ({
    accountId,
    returnUrl,
    description,
    amount,
  }): Promise<CreatePaymentResponse> => {
    try {
      const response = await this.serviceChargeClient.createPayment(
        this.generateRandomAlphaNumericString(10),
        returnUrl,
        description,
        amount,
      );
      const value = {
        id: uuidv4(),
        ...response,
      };
      await this.repository.saveRecord(
        this.draftContainerName,
        value,
        accountId,
      );
      return success({
        id: value.id,
        redirectUrl: value.redirectUrl,
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setPayment: Handler<SetPaymentRequest, SetPaymentResponse> = async ({
    id,
    accountId,
  }): Promise<SetPaymentResponse> => {
    try {
      const { paymentId } = await this.repository.getRecord(
        accountId,
        this.draftContainerName,
        id,
      );
      const response = await this.serviceChargeClient.getPayment(paymentId);
      const value = {
        id,
        ...response,
      };
      if (response.state.status === 'Success') {
        let startDate = '';
        try {
          const { expiryDate } = (await this.repository.getRecord(
            accountId,
          )) as PaymentRecord;
          if (new Date(expiryDate as string) >= new Date()) {
            startDate = expiryDate as string;
          }
        } catch (err) {
          if (err instanceof Boom.Boom && err.output.statusCode === 404) {
            startDate = '';
          } else {
            throw err;
          }
        }

        value.expiryDate = this.calculateRenewalDate(
          !startDate ? response.state.capturedDate : startDate,
        );

        await this.repository.saveRecord(
          this.serviceChargeContainerName,
          value,
          accountId,
        );
        await this.repository.deleteRecord(
          this.draftContainerName,
          id,
          accountId,
        );
      } else {
        if (response.state.status !== 'InProgress') {
          await this.repository.deleteRecord(
            this.draftContainerName,
            id,
            accountId,
          );
        }
      }
      return success({
        id: value.id,
        amount: value.amount,
        description: value.description,
        reference: value.reference,
        state: value.state,
        expiryDate: value.expiryDate,
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getPayment: Handler<GetPaymentRequest, GetPaymentResponse> = async ({
    accountId,
  }): Promise<GetPaymentResponse> => {
    try {
      let startDate = '';
      let serviceChargePaid = false;
      try {
        const { expiryDate } = (await this.repository.getRecord(
          accountId,
        )) as PaymentRecord;
        if (new Date(expiryDate as string) >= new Date()) {
          serviceChargePaid = true;
          startDate = expiryDate as string;
        }
      } catch (err) {
        if (err instanceof Boom.Boom && err.output.statusCode === 404) {
          startDate = '';
        } else {
          throw err;
        }
      }

      return success({
        serviceChargePaid,
        expiryDate: startDate,
        renewalDate: this.calculateRenewalDate(startDate),
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  cancelPayment: Handler<CancelPaymentRequest, CancelPaymentResponse> = async ({
    id,
    accountId,
  }): Promise<CancelPaymentResponse> => {
    try {
      console.log('here');
      const { paymentId } = await this.repository.getRecord(
        accountId,
        this.draftContainerName,
        id,
      );
      console.log('Payment ID: ' + paymentId);
      await this.serviceChargeClient.cancelPayment(paymentId);
      console.log('here2');
      await this.repository.deleteRecord(
        this.draftContainerName,
        id,
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
