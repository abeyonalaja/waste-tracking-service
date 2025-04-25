import {
  CosmosClient,
  Item,
  ItemResponse,
  Items,
  QueryIterator,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import CosmosBatchRepository from './cosmos-batches';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRead = jest.fn<typeof Item.prototype.read>();
const mockPatch = jest.fn<typeof Item.prototype.patch>();
const mockCreate = jest.fn<typeof Items.prototype.create>();
const mockFetchNext = jest.fn<typeof QueryIterator.prototype.fetchNext>();

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn(() => ({
      container: jest.fn(() => ({
        item: jest.fn(() => ({
          read: mockRead,
          patch: mockPatch,
        })),
        items: {
          create: mockCreate,
          query: jest.fn(() => ({
            fetchNext: mockFetchNext,
          })),
        },
      })),
    })),
  })),
}));

describe(CosmosBatchRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockFetchNext.mockClear();
  });

  const mockCosmosEndpoint = faker.string.sample();
  const mockCosmosKey = faker.string.sample();
  const mockCosmosDbName = faker.string.sample();
  const mockCosmosContainerName = faker.string.sample();
  const logger = new Logger();

  const subject = new CosmosBatchRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    mockCosmosContainerName,
    logger,
  );

  describe('getBatch', () => {
    it('retrieves a value with the associated id', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const timestamp = new Date();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          state: {
            status: 'Processing',
            timestamp: timestamp,
          },
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

      const result = await subject.getBatch(id, accountId);
      expect(result).toEqual({
        id,
        state: {
          status: 'Processing',
          timestamp: timestamp,
        },
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getBatch(id, accountId)).rejects.toThrow(Boom.notFound());
      expect(mockRead).toBeCalledTimes(1);
    });
  });
});
