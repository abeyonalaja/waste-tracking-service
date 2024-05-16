import {
  CosmosClient,
  FeedResponse,
  Item,
  Items,
  QueryIterator,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import CosmosRepository from './cosmos-repository';
import { DbContainerNameKey } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRead = jest.fn<typeof Item.prototype.read>();
const mockPatch = jest.fn<typeof Item.prototype.patch>();
const mockCreate = jest.fn<typeof Items.prototype.create>();
const mockBulk = jest.fn<typeof Items.prototype.bulk>();
const mockDelete = jest.fn<typeof Item.prototype.delete>();
const mockFetchNext = jest.fn<typeof QueryIterator.prototype.fetchNext>();
const mockFetchAll = jest.fn<typeof QueryIterator.prototype.fetchAll>();
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
          query: jest.fn(() => ({
            fetchNext: mockFetchNext,
            fetchAll: mockFetchAll,
          })),
          bulk: mockBulk,
        },
      })),
    })),
  })),
}));

describe(CosmosRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockBulk.mockClear();
    mockDelete.mockClear();
    mockFetchNext.mockClear();
    mockFetchAll.mockClear();
  });

  const mockCosmosEndpoint = faker.datatype.string();
  const mockCosmosKey = faker.datatype.string();
  const mockCosmosDbName = faker.datatype.string();
  const cosmosContainerMap = new Map<DbContainerNameKey, string>([
    ['drafts', 'drafts'],
  ]);
  const logger = new Logger();

  const subject = new CosmosRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    cosmosContainerMap,
    logger
  );

  describe('getRecord', () => {
    it('retrieves a draft with the associated id', async () => {
      const mockId = faker.datatype.uuid();
      const mockContainerName = 'drafts';
      const mockDraftSubmission = {
        id: mockId,
        transactionId: 'testTransactionId',
        wasteInformation: {},
        receiver: {},
        producerAndCollection: {},
        submissionDeclaration: {},
        submissionState: {},
      };

      mockFetchAll.mockResolvedValueOnce({
        resources: [{ value: mockDraftSubmission }],
      } as unknown as FeedResponse<object>);

      const result = await subject.getDraft(mockContainerName, mockId);

      expect(result).toEqual(mockDraftSubmission);
      expect(mockFetchAll).toHaveBeenCalled();
    });
  });
});
