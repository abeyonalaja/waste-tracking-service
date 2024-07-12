import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import { CreatedPayment, PaymentRecord } from '../model';
import PaymentController from './service-charge-controller';
import Boom from '@hapi/boom';
import { faker } from '@faker-js/faker';
import CosmosServiceChargeRepository from '../data/cosmos-repository';
import GovUkPayServiceChargeClient from '../clients/service-charge-client';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockPaymentClient = {
  createPayment: jest.fn<GovUkPayServiceChargeClient['createPayment']>(),
  getPayment: jest.fn<GovUkPayServiceChargeClient['getPayment']>(),
  cancelPayment: jest.fn<GovUkPayServiceChargeClient['cancelPayment']>(),
};

const mockRepository = {
  getRecord: jest.fn<CosmosServiceChargeRepository['getRecord']>(),
  saveRecord: jest.fn<CosmosServiceChargeRepository['saveRecord']>(),
  deleteRecord: jest.fn<CosmosServiceChargeRepository['deleteRecord']>(),
};

describe(PaymentController, () => {
  const subject = new PaymentController(
    mockPaymentClient as unknown as GovUkPayServiceChargeClient,
    mockRepository as unknown as CosmosServiceChargeRepository,
    new Logger(),
  );

  beforeEach(() => {
    mockPaymentClient.getPayment.mockClear();
    mockPaymentClient.createPayment.mockClear();
    mockPaymentClient.cancelPayment.mockClear();
    mockRepository.getRecord.mockClear();
    mockRepository.saveRecord.mockClear();
    mockRepository.deleteRecord.mockClear();
  });

  const accountId = faker.string.uuid();

  const amount = 2000;
  const description = 'Annual waste tracking service charge';
  const reference = '8I8YI3P1KT';
  const returnUrl = 'https://my-return-url.com';
  const createdDate = faker.defaultRefDate().toJSON();
  const paymentId = 'g9fbn8fe4bh2blv1v8dakafsnd';

  describe('createPayment', () => {
    it('forwards thrown Boom errors from repository', async () => {
      const id = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockPaymentClient.createPayment.mockResolvedValueOnce(value);
      mockRepository.saveRecord.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.createPayment({
        accountId,
        returnUrl,
        description,
        amount,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockPaymentClient.createPayment).toBeCalledTimes(1);
      expect(mockRepository.saveRecord).toBeCalledTimes(1);
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown Boom errors from client', async () => {
      const accountId = faker.string.uuid();

      mockPaymentClient.createPayment.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.createPayment({
        accountId,
        returnUrl,
        description,
        amount,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockPaymentClient.createPayment).toBeCalledTimes(1);
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown unknown errors', async () => {
      const accountId = faker.string.uuid();

      mockPaymentClient.createPayment.mockRejectedValueOnce(new Error());

      const response = await subject.createPayment({
        accountId,
        returnUrl,
        description,
        amount,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockPaymentClient.createPayment).toBeCalledTimes(1);
      expect(response.error.statusCode).toBe(500);
    });

    it('successfully returns InProgress value', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockPaymentClient.createPayment.mockResolvedValueOnce(value);
      mockRepository.saveRecord.mockResolvedValueOnce();

      const response = await subject.createPayment({
        accountId,
        returnUrl,
        description,
        amount,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockPaymentClient.createPayment).toHaveBeenCalledTimes(1);
      expect(mockRepository.saveRecord).toBeCalledWith(
        subject.draftContainerName,
        value,
        accountId,
      );
      expect(response.value.id).toEqual(value.id);
      expect(response.value.redirectUrl).toEqual(value.redirectUrl);
    });
  });

  describe('setPayment', () => {
    it('forwards thrown Boom errors from repository record', async () => {
      const id = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.setPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown Boom errors from repository expiryDate check', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.getPayment.mockResolvedValueOnce({
        amount,
        description,
        reference,
        paymentId: value.paymentId,
        state: {
          status: 'Success',
          capturedDate: '2024-07-07',
        },
      });
      mockRepository.getRecord.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.setPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockPaymentClient.getPayment).toHaveBeenCalledWith(
        value.paymentId,
      );
      expect(mockRepository.getRecord).toBeCalledWith(accountId);
      expect(mockRepository.getRecord).toBeCalledTimes(2);
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown Boom errors from client', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.getPayment.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.setPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockPaymentClient.getPayment).toBeCalledWith(value.paymentId);
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown unknown errors', async () => {
      const id = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValueOnce(new Error());

      const response = await subject.setPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(response.error.statusCode).toBe(500);
    });

    it('successfully returns InProgress value', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.getPayment.mockResolvedValueOnce({
        amount,
        description,
        reference,
        paymentId: value.paymentId,
        state: {
          status: 'InProgress',
        },
      });

      const response = await subject.setPayment({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockPaymentClient.getPayment).toHaveBeenCalledWith(
        value.paymentId,
      );
      expect(response.value).toEqual({
        id,
        amount,
        description,
        reference,
        state: {
          status: 'InProgress',
        },
      });
    });

    it('successfully returns Success value for initial payment', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };
      const responseValue: PaymentRecord = {
        id,
        amount,
        description,
        reference,
        paymentId: value.paymentId,
        state: {
          status: 'Success',
          capturedDate: '2024-06-28',
        },
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.getPayment.mockResolvedValueOnce({
        amount: responseValue.amount,
        description: responseValue.description,
        reference: responseValue.reference,
        paymentId: responseValue.paymentId,
        state: responseValue.state,
      });
      mockRepository.getRecord.mockRejectedValueOnce(Boom.notFound());
      mockRepository.saveRecord.mockResolvedValueOnce();
      mockRepository.deleteRecord.mockResolvedValueOnce();

      const response = await subject.setPayment({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      responseValue.expiryDate = '2025-06-27';

      expect(mockPaymentClient.getPayment).toHaveBeenCalledWith(
        value.paymentId,
      );
      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockRepository.saveRecord).toBeCalledWith(
        subject.serviceChargeContainerName,
        responseValue,
        accountId,
      );
      expect(mockRepository.deleteRecord).toBeCalledWith(
        subject.draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual({
        id: responseValue.id,
        amount: responseValue.amount,
        description: responseValue.description,
        reference: responseValue.reference,
        state: responseValue.state,
        expiryDate: responseValue.expiryDate,
      });
    });

    it('successfully returns Success value for renewed payment', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };
      const responseValue: PaymentRecord = {
        id,
        amount,
        description,
        reference,
        paymentId: value.paymentId,
        state: {
          status: 'Success',
          capturedDate: '2024-06-28',
        },
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.getPayment.mockResolvedValueOnce({
        amount: responseValue.amount,
        description: responseValue.description,
        reference: responseValue.reference,
        paymentId: responseValue.paymentId,
        state: responseValue.state,
      });
      mockRepository.getRecord.mockResolvedValueOnce({
        ...value,
        expiryDate: '2025-07-01',
      });
      mockRepository.saveRecord.mockResolvedValueOnce();
      mockRepository.deleteRecord.mockResolvedValueOnce();

      const response = await subject.setPayment({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      responseValue.expiryDate = '2026-06-30';

      expect(mockPaymentClient.getPayment).toHaveBeenCalledWith(
        value.paymentId,
      );
      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockRepository.saveRecord).toBeCalledWith(
        subject.serviceChargeContainerName,
        responseValue,
        accountId,
      );
      expect(mockRepository.deleteRecord).toBeCalledWith(
        subject.draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual({
        id: responseValue.id,
        amount: responseValue.amount,
        description: responseValue.description,
        reference: responseValue.reference,
        state: responseValue.state,
        expiryDate: responseValue.expiryDate,
      });
    });

    it('successfully returns Error value', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };
      const responseValue: PaymentRecord = {
        id,
        amount,
        description,
        reference,
        paymentId: value.paymentId,
        state: {
          status: 'Error',
          code: 'P0050',
        },
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.getPayment.mockResolvedValueOnce({
        amount: responseValue.amount,
        description: responseValue.description,
        reference: responseValue.reference,
        paymentId: responseValue.paymentId,
        state: responseValue.state,
      });
      mockRepository.deleteRecord.mockResolvedValueOnce();

      const response = await subject.setPayment({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockPaymentClient.getPayment).toHaveBeenCalledWith(
        value.paymentId,
      );
      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockRepository.deleteRecord).toBeCalledWith(
        subject.draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual({
        id: responseValue.id,
        amount: responseValue.amount,
        description: responseValue.description,
        reference: responseValue.reference,
        state: responseValue.state,
      });
    });
  });

  describe('getPayment', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.getPayment({
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown unknown errors', async () => {
      mockRepository.getRecord.mockRejectedValueOnce(new Error());

      const response = await subject.getPayment({
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(accountId);
      expect(response.error.statusCode).toBe(500);
    });

    it('successfully returns value for initial payment', async () => {
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockRejectedValueOnce(Boom.notFound());

      const response = await subject.getPayment({
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(accountId);
      expect(response.value).toEqual({
        serviceChargePaid: false,
        expiryDate: '',
        renewalDate: subject.calculateRenewalDate(),
      });
    });

    it('successfully returns value for renewed payment', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: PaymentRecord = {
        id,
        amount,
        description,
        reference,
        paymentId,
        state: {
          status: 'Success',
          capturedDate: '2024-07-02',
        },
        expiryDate: '2025-07-01',
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);

      const response = await subject.getPayment({
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(accountId);
      expect(response.value).toEqual({
        serviceChargePaid: true,
        expiryDate: '2025-07-01',
        renewalDate: '2026-06-30',
      });
    });
  });

  describe('cancelPayment', () => {
    it('forwards thrown Boom errors from repository record', async () => {
      const id = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.cancelPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown Boom errors from client', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.cancelPayment.mockRejectedValueOnce(Boom.teapot());

      const response = await subject.cancelPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockPaymentClient.cancelPayment).toBeCalledWith(value.paymentId);
      expect(response.error.statusCode).toBe(418);
    });

    it('forwards thrown unknown errors', async () => {
      const id = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValueOnce(new Error());

      const response = await subject.cancelPayment({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(response.error.statusCode).toBe(500);
    });

    it('successfully returns value', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: CreatedPayment = {
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      };

      mockRepository.getRecord.mockResolvedValueOnce(value);
      mockPaymentClient.cancelPayment.mockResolvedValueOnce();
      mockRepository.deleteRecord.mockResolvedValueOnce();

      const response = await subject.cancelPayment({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        accountId,
        subject.draftContainerName,
        id,
      );
      expect(mockPaymentClient.cancelPayment).toHaveBeenCalledWith(
        value.paymentId,
      );
      expect(mockRepository.deleteRecord).toBeCalledWith(
        subject.draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(undefined);
    });
  });

  describe('generateRandomAlphaNumericString', () => {
    const alphaNumericRegex = new RegExp('^[a-zA-Z0-9]*$');

    it('returns value in correct format', async () => {
      const char = 10;
      const str = subject.generateRandomAlphaNumericString(char);

      expect(alphaNumericRegex.test(str)).toBe(true);
      expect(str.length).toBe(char);
    });
  });

  describe('calculateRenewalDate', () => {
    const yyyyMMddRegex = new RegExp(
      '^((20)\\d\\d)-(0?[1-9]|1[012])-([12][0-9]|3[01]|0?[1-9])',
    );

    it("returns value derived from today's date in correct format", async () => {
      const date = '';
      const expiryDate = subject.calculateRenewalDate(date);

      expect(yyyyMMddRegex.test(expiryDate)).toBe(true);
      expect(expiryDate.length).toBe(10);
    });

    it('returns value derived from fixed date in correct format', async () => {
      const date = '2024-07-05';
      const expiryDate = subject.calculateRenewalDate(date);

      expect(yyyyMMddRegex.test(expiryDate)).toBe(true);
      expect(expiryDate.length).toBe(10);
    });
  });
});
