import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { PaymentServiceBackend } from './payment.backend';
import { Logger } from 'winston';
import { DaprPaymentClient } from '@wts/client/payment';
import Boom from '@hapi/boom';
import {
  CreatedPayment,
  PaymentRecord,
  PaymentReference,
} from '@wts/api/waste-tracking-gateway';
import { LRUCache } from 'lru-cache';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  createPayment: jest.fn<DaprPaymentClient['createPayment']>(),
  setPayment: jest.fn<DaprPaymentClient['setPayment']>(),
  getPayment: jest.fn<DaprPaymentClient['getPayment']>(),
};

const mockCache = {
  get: jest.fn<(k: string) => boolean | undefined>(),
  set: jest.fn<(k: string, v: boolean) => LRUCache<string, PaymentReference>>,
};

describe(PaymentServiceBackend, () => {
  const subject = new PaymentServiceBackend(
    mockClient as unknown as DaprPaymentClient,
    mockCache as unknown as LRUCache<string, PaymentReference>,
    new Logger(),
  );

  beforeEach(() => {
    mockClient.createPayment.mockClear();
    mockClient.setPayment.mockClear();
    mockClient.getPayment.mockClear();
    mockCache.get.mockClear();
  });

  describe('createPayment', () => {
    it('throws client error if unsuccessful response was returned via Dapr', async () => {
      const accountId = faker.string.uuid();
      const returnUrl = faker.string.sample();
      mockClient.createPayment.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 404,
          name: 'Test',
          message: 'Not Found',
        },
      });

      try {
        await subject.createPayment(accountId, { returnUrl });
      } catch (err) {
        expect(err).toEqual(Boom.notFound());
      }
      expect(mockClient.createPayment).toBeCalledWith({ accountId, returnUrl });
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const accountId = faker.string.uuid();
      const returnUrl = faker.string.sample();
      mockClient.createPayment.mockRejectedValueOnce(Boom.teapot());

      try {
        await subject.createPayment(accountId, { returnUrl });
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockClient.createPayment).toBeCalledWith({ accountId, returnUrl });
    });

    it('returns successful response', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const returnUrl = faker.string.sample();
      const value: CreatedPayment = {
        id,
        amount: faker.number.int({ min: 0, max: 5000 }),
        description: faker.string.sample(),
        reference: faker.string.sample(10),
        paymentId: faker.string.sample(),
        createdDate: faker.string.sample(),
        returnUrl: returnUrl,
        redirectUrl: {
          href: faker.string.sample(),
          method: 'GET',
        },
        cancelUrl: {
          href: faker.string.sample(),
          method: 'POST',
        },
      };
      mockClient.createPayment.mockResolvedValueOnce({
        success: true,
        value: value,
      });

      expect(await subject.createPayment(accountId, { returnUrl })).toEqual(
        value,
      );
      expect(mockClient.createPayment).toBeCalledWith({ accountId, returnUrl });
    });
  });

  describe('setPayment', () => {
    it('throws client error if unsuccessful response was returned via Dapr', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockClient.setPayment.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 404,
          name: 'Test',
          message: 'Not Found',
        },
      });

      try {
        await subject.setPayment({ id, accountId });
      } catch (err) {
        expect(err).toEqual(Boom.notFound());
      }
      expect(mockClient.setPayment).toBeCalledWith({ id, accountId });
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockClient.setPayment.mockRejectedValueOnce(Boom.teapot());

      try {
        await subject.setPayment({ id, accountId });
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockClient.setPayment).toBeCalledWith({ id, accountId });
    });

    it('returns successful response', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: PaymentRecord = {
        id,
        amount: faker.number.int({ min: 0, max: 5000 }),
        description: faker.string.sample(),
        reference: faker.string.sample(10),
        paymentId: faker.string.sample(),
        state: {
          status: 'Success',
          capturedDate: '2024-09-03',
        },
        expiryDate: '2025-09-02',
      };
      mockClient.setPayment.mockResolvedValueOnce({
        success: true,
        value: value,
      });

      expect(await subject.setPayment({ id, accountId })).toEqual(value);
      expect(mockClient.setPayment).toBeCalledWith({ id, accountId });
    });
  });

  describe('getPayment', () => {
    it('throws client error if unsuccessful response was returned via Dapr', async () => {
      const accountId = faker.string.uuid();
      mockClient.getPayment.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 404,
          name: 'Test',
          message: 'Not Found',
        },
      });

      try {
        await subject.getPayment(accountId);
      } catch (err) {
        expect(err).toEqual(Boom.notFound());
      }
      expect(mockClient.getPayment).toBeCalledWith({ accountId });
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const accountId = faker.string.uuid();
      mockClient.getPayment.mockRejectedValueOnce(Boom.teapot());

      try {
        await subject.getPayment(accountId);
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockClient.getPayment).toBeCalledWith({ accountId });
    });

    it('returns successful response', async () => {
      const accountId = faker.string.uuid();
      mockClient.getPayment.mockResolvedValueOnce({
        success: true,
        value: {
          serviceChargePaid: true,
          expiryDate: '2024-09-02',
          renewalDate: '2025-09-01',
        },
      });

      expect(await subject.getPayment(accountId)).toEqual({
        serviceChargePaid: true,
        expiryDate: '2024-09-02',
        renewalDate: '2025-09-01',
      });
      expect(mockClient.getPayment).toBeCalledWith({ accountId });
    });

    it('does not invoke backend service if cached true', async () => {
      const accountId = faker.string.uuid();
      mockCache.get.mockReturnValue(true);

      expect(await subject.getPayment(accountId)).toBe(true);
      expect(mockClient.getPayment).not.toHaveBeenCalled();
    });
  });
});
