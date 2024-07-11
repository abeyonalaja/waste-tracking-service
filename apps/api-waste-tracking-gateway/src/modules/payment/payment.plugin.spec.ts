import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { Lifecycle, ReqRefDefaults, server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import { PaymentBackend, PaymentRef } from './payment.backend';
import bulkSubmissionPlugin from './payment.plugin';
import {
  CreatedPayment,
  PaymentDetail,
  PaymentRecord,
  PaymentReference,
} from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = '964cc80b-da90-4675-ac05-d4d1d79ac888';

const mockBackend = {
  createPayment:
    jest.fn<
      (
        accountId: PaymentRef['accountId'],
        value: PaymentDetail,
      ) => Promise<CreatedPayment>
    >(),
  setPayment: jest.fn<(ref: PaymentRef) => Promise<PaymentRecord>>(),
  getPayment:
    jest.fn<
      (accountId: PaymentRef['accountId']) => Promise<PaymentReference>
    >(),
};

const app = server({
  host: 'localhost',
  port: 3010,
});

beforeAll(async () => {
  await app.register({
    plugin: bulkSubmissionPlugin,
    options: {
      backend: mockBackend as unknown as PaymentBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/payments',
    },
  });

  app.auth.scheme('mock', function () {
    return {
      authenticate: async function (
        _,
        h,
      ): Promise<Lifecycle.ReturnValueTypes<ReqRefDefaults>> {
        return h.authenticated({ credentials: { accountId } });
      },
    };
  });

  app.auth.strategy('mock', 'mock');
  app.auth.default('mock');

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('PaymentPlugin', () => {
  beforeEach(() => {
    mockBackend.createPayment.mockClear();
    mockBackend.setPayment.mockClear();
    mockBackend.getPayment.mockClear();
  });

  describe('POST /payments', () => {
    it('Responds 400 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/payments',
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /payments/{id}', () => {
    it("Responds 404 if draft payment record doesn't exist", async () => {
      const options = {
        method: 'PUT',
        url: `/payments/${faker.string.uuid()}`,
      };

      mockBackend.setPayment.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
