import Boom from '@hapi/boom';
import {
  CancelPaymentResponse,
  CreatePaymentResponse,
  GetPaymentResponse,
  SetPaymentResponse,
} from '@wts/api/payment';
import {
  CreatedPayment,
  PaymentDetail,
  PaymentRecord,
  PaymentReference,
} from '@wts/api/waste-tracking-gateway';
import { DaprPaymentClient } from '@wts/client/payment';
import { LRUCache } from 'lru-cache';
import { Logger } from 'winston';

export interface PaymentRef {
  id: string;
  accountId: string;
}

export interface PaymentBackend {
  createPayment(
    accountId: PaymentRef['accountId'],
    value: PaymentDetail,
  ): Promise<CreatedPayment>;
  setPayment(ref: PaymentRef): Promise<PaymentRecord>;
  getPayment(accountId: PaymentRef['accountId']): Promise<PaymentReference>;
  cancelPayment(ref: PaymentRef): Promise<void>;
}

export class PaymentServiceBackend implements PaymentBackend {
  constructor(
    private client: DaprPaymentClient,
    private cache: LRUCache<string, PaymentReference>,
    private logger: Logger,
  ) {}

  async createPayment(
    accountId: PaymentRef['accountId'],
    value: PaymentDetail,
  ): Promise<CreatedPayment> {
    let response: CreatePaymentResponse;
    try {
      response = await this.client.createPayment({
        accountId,
        ...value,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async setPayment({ id, accountId }: PaymentRef): Promise<PaymentRecord> {
    let response: SetPaymentResponse;
    try {
      response = await this.client.setPayment({
        id,
        accountId,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async getPayment(
    accountId: PaymentRef['accountId'],
  ): Promise<PaymentReference> {
    let response: GetPaymentResponse;
    try {
      const cached = this.cache.get(accountId);
      if (cached !== undefined && cached) {
        return cached;
      }

      response = await this.client.getPayment({
        accountId,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    this.cache.set(accountId, response.value);
    return response.value;
  }

  async cancelPayment({ id, accountId }: PaymentRef): Promise<void> {
    let response: CancelPaymentResponse;
    try {
      response = await this.client.cancelPayment({
        id,
        accountId,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }
}
