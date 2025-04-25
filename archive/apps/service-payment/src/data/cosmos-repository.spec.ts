import { CosmosClient, Item, ItemResponse, Items } from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import ServiceChargeRepository from './cosmos-repository';
import { DbContainerNameKey } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRead = jest.fn<typeof Item.prototype.read>();
const mockPatch = jest.fn<typeof Item.prototype.patch>();
const mockCreate = jest.fn<typeof Items.prototype.create>();
const mockDelete = jest.fn<typeof Item.prototype.delete>();

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn(() => ({
      container: jest.fn(() => ({
        item: jest.fn(() => ({
          read: mockRead,
          patch: mockPatch,
          delete: mockDelete,
        })),
        items: {
          create: mockCreate,
        },
      })),
    })),
  })),
}));

describe(ServiceChargeRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockDelete.mockClear();
  });

  const mockCosmosEndpoint = faker.string.sample();
  const mockCosmosKey = faker.string.sample();
  const mockCosmosDbName = faker.string.sample();
  const cosmosContainerMap = new Map<DbContainerNameKey, string>([
    ['drafts', 'drafts'],
    ['service-charges', 'service-charges'],
  ]);
  const logger = new Logger();

  const subject = new ServiceChargeRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }).database(mockCosmosDbName),
    cosmosContainerMap,
    logger,
  );

  const amount = 2000;
  const description = 'Annual waste tracking service charge';
  const reference = '8I8YI3P1KT';
  const returnUrl = 'https://my-return-url.com';
  const createdDate = faker.defaultRefDate().toJSON();
  const paymentId = 'g9fbn8fe4bh2blv1v8dakafsnd';

  describe('getRecord', () => {
    it('retrieves a value with the associated id from drafts', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          amount,
          description,
          reference,
          paymentId,
          createdDate,
          returnUrl,
          redirectUrl:
            'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
        },
        partitionKey: accountId,
        _rid: faker.string.sample(),
        _self: faker.string.sample(),
        _etag: faker.string.sample(),
        _attachments: faker.string.sample(),
        _ts: faker.number.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getRecord(accountId, 'drafts', id);
      expect(result).toEqual({
        id,
        amount,
        description,
        reference,
        paymentId,
        createdDate,
        returnUrl,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves a value with the associated id from service-charges', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          amount,
          description,
          reference,
          paymentId,
          state: {
            status: 'Success',
            capturedDate: '2024-06-28',
          },
          expiryDate: '2024-06-28',
        },
        partitionKey: accountId,
        _rid: faker.string.sample(),
        _self: faker.string.sample(),
        _etag: faker.string.sample(),
        _attachments: faker.string.sample(),
        _ts: faker.number.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getRecord(accountId, 'service-charges', id);
      expect(result).toEqual({
        id,
        amount,
        description,
        reference,
        paymentId,
        state: {
          status: 'Success',
          capturedDate: '2024-06-28',
        },
        expiryDate: '2024-06-28',
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getRecord(accountId, 'drafts', id)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(1);
    });
  });
});
