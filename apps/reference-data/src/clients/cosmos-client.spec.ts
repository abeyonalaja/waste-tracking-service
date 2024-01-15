import {
  CosmosClient,
  FeedResponse,
  Item,
  ItemResponse,
  Items,
  QueryIterator,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { CosmosReferenceDataClient } from '../clients';

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

describe(CosmosReferenceDataClient, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockFetchNext.mockClear();
  });

  const cosmosEndpoint = faker.datatype.string();
  const cosmosKey = faker.datatype.string();
  const cosmosDbName = faker.datatype.string();
  const cosmosContainerName = faker.datatype.string();
  const subject = new CosmosReferenceDataClient(
    new CosmosClient({
      endpoint: cosmosEndpoint,
      key: cosmosKey,
    }),
    cosmosDbName
  );

  describe('readItem', () => {
    it('handles empty response', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as ItemResponse<object>);

      const result = await subject.readItem(cosmosContainerName, id, accountId);
      expect(result).toEqual(undefined);
      expect(mockRead).toBeCalledTimes(1);
    });
  });

  describe('queryContainerNext', () => {
    it('handles empty response', async () => {
      const accountId = faker.datatype.uuid();
      mockFetchNext.mockResolvedValueOnce({
        resources: undefined,
      } as unknown as FeedResponse<object>);

      const querySpec = {
        query: 'SELECT * FROM c',
      };
      const queryOptions = {
        maxItemCount: 15,
        partitionKey: accountId,
        continuationToken: '',
      };

      const result = await subject.queryContainerNext(
        cosmosContainerName,
        querySpec,
        queryOptions
      );
      expect(result).toEqual({
        results: undefined,
        hasMoreResults: undefined,
        continuationToken: undefined,
      });
      expect(mockFetchNext).toBeCalledTimes(1);
    });
  });
});
