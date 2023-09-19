import { CosmosClient } from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import CosmosDraftRepository from './cosmos-drafts';
import { CosmosAnnexViiClient } from '../clients';

const mockReadItem = jest.fn<typeof CosmosAnnexViiClient.prototype.readItem>();
const mockQueryContainerNext =
  jest.fn<typeof CosmosAnnexViiClient.prototype.queryContainerNext>();
const mockCreateOrReplaceItem =
  jest.fn<typeof CosmosAnnexViiClient.prototype.createOrReplaceItem>();

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn(() => ({
      container: jest.fn(),
    })),
  })),
}));

jest.mock('../clients', () => ({
  CosmosAnnexViiClient: jest.fn().mockImplementation(() => ({
    readItem: mockReadItem,
    queryContainerNext: mockQueryContainerNext,
    createOrReplaceItem: mockCreateOrReplaceItem,
  })),
}));

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

describe(CosmosDraftRepository, () => {
  beforeEach(() => {
    mockReadItem.mockClear();
    mockQueryContainerNext.mockClear();
    mockCreateOrReplaceItem.mockClear();
  });

  const mockCosmosEndpoint = faker.datatype.string();
  const mockCosmosKey = faker.datatype.string();
  const mockCosmosDbName = faker.datatype.string();
  const mockCosmosContainerName = faker.datatype.string();
  const logger = new Logger();

  const subject = new CosmosDraftRepository(
    new CosmosAnnexViiClient(
      new CosmosClient({
        endpoint: mockCosmosEndpoint,
        key: mockCosmosKey,
      }),
      mockCosmosDbName
    ),
    mockCosmosContainerName,
    logger
  );

  describe('getDrafts', () => {
    it('handles empty response', async () => {
      mockQueryContainerNext.mockResolvedValueOnce({
        results: undefined || [],
        hasMoreResults: false,
        continuationToken: '',
      });

      expect(await subject.getDrafts(faker.datatype.uuid(), 'ASC')).toEqual({
        totalSubmissions: 0,
        totalPages: 1,
        currentPage: 1,
        pages: [
          {
            pageNumber: 1,
            token: '',
          },
        ],
        values: [],
      });
    });
  });

  describe('getDraft', () => {
    it('retrieves a value with the associated id', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const timestamp = new Date();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          reference: null,
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: { status: 'NotStarted', transport: true },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: { status: 'InProgress', timestamp: timestamp },
        },
        partitionKey: accountId,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockReadItem.mockResolvedValueOnce(mockResponse);

      const result = await subject.getDraft(id, accountId);
      expect(result).toEqual({
        id,
        reference: null,
        carriers: { status: 'NotStarted', transport: true },
        collectionDate: { status: 'NotStarted' },
        collectionDetail: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
        transitCountries: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
      });
      expect(mockReadItem).toHaveBeenCalledWith(
        mockCosmosContainerName,
        id,
        accountId
      );
      expect(mockReadItem).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockReadItem.mockResolvedValueOnce(undefined);

      expect(subject.getDraft(id, accountId)).rejects.toThrow(Boom.notFound());
      expect(mockReadItem).toHaveBeenCalledWith(
        mockCosmosContainerName,
        id,
        accountId
      );
      expect(mockReadItem).toBeCalledTimes(1);
    });
  });
});
