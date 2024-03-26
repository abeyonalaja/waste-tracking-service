import {
  CosmosClient,
  FeedResponse,
  Item,
  ItemResponse,
  Items,
  QueryIterator,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import CosmosTemplateRepository from './cosmos-templates';

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

describe(CosmosTemplateRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockFetchNext.mockClear();
  });

  const mockCosmosEndpoint = faker.datatype.string();
  const mockCosmosKey = faker.datatype.string();
  const mockCosmosDbName = faker.datatype.string();
  const mockCosmosContainerName = faker.datatype.string();
  const logger = new Logger();

  const subject = new CosmosTemplateRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    mockCosmosContainerName,
    mockCosmosContainerName,
    logger
  );

  describe('getTemplates', () => {
    it('handles empty response', async () => {
      mockFetchNext.mockResolvedValueOnce({
        results: undefined || [],
        hasMoreResults: false,
        continuationToken: '',
      } as unknown as FeedResponse<object>);

      expect(await subject.getTemplates(faker.datatype.uuid(), 'ASC')).toEqual({
        totalTemplates: 0,
        totalPages: 0,
        currentPage: 0,
        pages: [],
        values: [],
      });
    });
  });

  describe('getNumberOfTemplates', () => {
    it('gets the number of templates', async () => {
      mockFetchNext.mockResolvedValueOnce({
        resources: [2],
        hasMoreResults: false,
        continuationToken: '',
      } as unknown as FeedResponse<object>);

      expect(await subject.getNumberOfTemplates(faker.datatype.uuid())).toEqual(
        2
      );
    });
  });

  describe('getTemplate', () => {
    it('retrieves a value with the associated id', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const timestamp = new Date();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          templateDetails: {
            name: 'Template Name',
            description: 'Template Description',
            created: timestamp,
            lastModified: timestamp,
          },
          wasteDescription: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          carriers: { status: 'NotStarted', transport: true },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
        },
        partitionKey: accountId,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getTemplate(id, accountId);
      expect(result).toEqual({
        id,
        templateDetails: {
          name: 'Template Name',
          description: 'Template Description',
          created: timestamp,
          lastModified: timestamp,
        },
        carriers: { status: 'NotStarted', transport: true },
        collectionDetail: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        transitCountries: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        wasteDescription: { status: 'NotStarted' },
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getTemplate(id, accountId)).rejects.toThrow(
        Boom.notFound()
      );
      expect(mockRead).toBeCalledTimes(1);
    });
  });
});
