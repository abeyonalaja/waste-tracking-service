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
import { Logger } from 'winston';
import CosmosRepository from './cosmos-repository';
import { DbContainerNameKey, GetDraftsDto, Draft } from '../model';

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

  const mockCosmosEndpoint = faker.string.sample();
  const mockCosmosKey = faker.string.sample();
  const mockCosmosDbName = faker.string.sample();
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
    logger,
  );

  describe('getDraft', () => {
    it('retrieves a draft with the associated id', async () => {
      const mockId = faker.string.uuid();
      const mockAccountId = faker.string.uuid();
      const mockContainerName = 'drafts';
      const mockDraftSubmission = {
        id: mockId,
        carrier: {},
        wasteInformation: {},
        receiver: {},
        producerAndCollection: {},
        declaration: {},
        state: {},
      };

      mockRead.mockResolvedValueOnce({
        resource: { value: mockDraftSubmission },
      } as unknown as ItemResponse<object>);

      const result = await subject.getDraft(
        mockContainerName,
        mockId,
        mockAccountId,
      );

      expect(result).toEqual(mockDraftSubmission);
      expect(mockRead).toHaveBeenCalled();
    });
  });

  describe('getDrafts', () => {
    it('successfully retrieves drafts', async () => {
      const mockContainerName = 'drafts';
      const mockDraftSubmissions: GetDraftsDto[] = [...Array(30).keys()].map(
        (i) => ({
          id: faker.string.uuid(),
          ewcCode: i.toString().padStart(6, '0'),
          producerName: faker.company.name(),
          wasteMovementId: `WM24_${i.toString().padStart(3, '0')}9ACAD`,
          collectionDate: {
            day: ((i % 31) + 1).toString(),
            month: ((i % 12) + 1).toString(),
            year: (2000 + i).toString(),
          },
        }),
      );

      mockFetchAll.mockResolvedValueOnce({
        resources: mockDraftSubmissions,
      } as unknown as FeedResponse<object>);

      const result = await subject.getDrafts(
        mockContainerName,
        1,
        10,
        undefined,
        undefined,
        undefined,
        'WM24_0019ACAD',
      );

      expect(result).toEqual({
        page: 1,
        totalPages: 1,
        totalRecords: 30,
        values: mockDraftSubmissions,
      });
      expect(mockFetchAll).toHaveBeenCalled();
    });
  });

  describe('saveRecord', () => {
    it('successfully saves a new record', async () => {
      const accountId = faker.string.uuid();
      const record = {
        id: '1',
        wasteInformation: {
          status: 'Complete',
          wasteTypes: [
            {
              ewcCode: '20 03 01',
              wasteDescription: 'Mixed municipal waste',
              physicalForm: 'Solid',
              wasteQuantity: 100,
              quantityUnit: 'Tonne',
              wasteQuantityType: 'ActualData',
              chemicalAndBiologicalComponents: [
                {
                  name: 'Component1',
                  concentration: 50,
                  concentrationUnit: '%',
                },
              ],
              hasHazardousProperties: false,
              containsPops: false,
            },
          ],
          wasteTransportation: {
            numberAndTypeOfContainers: '10 x 20ft containers',
          },
        },
        receiver: {
          status: 'Complete',
          value: {
            authorizationType: 'Type1',
            environmentalPermitNumber: 'EPN123',
            contact: {
              organisationName: 'Organisation1',
              name: 'Contact1',
              email: 'contact1@example.com',
              phone: '1234567890',
            },
            address: {
              addressLine1: 'Address Line 1',
              townCity: 'City1',
              country: 'Country1',
            },
          },
        },
        producerAndCollection: {
          status: 'Complete',
          producer: {
            reference: 'REF123',
            address: {
              status: 'Complete',
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
            contact: {
              status: 'Complete',
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            localAuthority: 'LA1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: 'Address Line 3',
              townCity: 'City3',
              country: 'Country3',
            },
          },
        },
        carrier: {
          status: 'Complete',
          value: {
            contact: {
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
            address: {
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
          },
        },
        declaration: {
          status: 'Complete',
          value: {
            declarationTimestamp: new Date(),
            transactionId: '123',
          },
        },
        state: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      } as Draft;

      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      mockCreate.mockResolvedValueOnce({
        resource: record,
      } as unknown as ItemResponse<object>);

      await subject.saveRecord('drafts', record, accountId);

      expect(mockCreate).toBeCalled();
      expect(mockPatch).not.toBeCalled();
    });

    it('successfully updates an existing record', async () => {
      const accountId = faker.string.uuid();
      const record = {
        id: '1',
        wasteInformation: {
          status: 'Complete',
          wasteTypes: [
            {
              ewcCode: '20 03 01',
              wasteDescription: 'Mixed municipal waste',
              physicalForm: 'Solid',
              wasteQuantity: 100,
              quantityUnit: 'Tonne',
              wasteQuantityType: 'ActualData',
              chemicalAndBiologicalComponents: [
                {
                  name: 'Component1',
                  concentration: 50,
                  concentrationUnit: '%',
                },
              ],
              hasHazardousProperties: false,
              containsPops: false,
            },
          ],
          wasteTransportation: {
            numberAndTypeOfContainers: '10 x 20ft containers',
          },
        },
        receiver: {
          status: 'Complete',
          value: {
            authorizationType: 'Type1',
            environmentalPermitNumber: 'EPN123',
            contact: {
              organisationName: 'Organisation1',
              name: 'Contact1',
              email: 'contact1@example.com',
              phone: '1234567890',
            },
            address: {
              addressLine1: 'Address Line 1',
              townCity: 'City1',
              country: 'Country1',
            },
          },
        },
        producerAndCollection: {
          status: 'Complete',
          producer: {
            reference: 'REF123',
            address: {
              status: 'Complete',
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
            contact: {
              status: 'Complete',
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            localAuthority: 'LA1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: 'Address Line 3',
              townCity: 'City3',
              country: 'Country3',
            },
          },
        },
        carrier: {
          status: 'Complete',
          value: {
            contact: {
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
            address: {
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
          },
        },
        declaration: {
          status: 'Complete',
          value: {
            declarationTimestamp: new Date(),
            transactionId: '123',
          },
        },
        state: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      } as Draft;

      mockRead.mockResolvedValueOnce({
        resource: record,
      } as unknown as ItemResponse<object>);

      mockCreate.mockResolvedValueOnce({
        resource: record,
      } as unknown as ItemResponse<object>);

      await subject.saveRecord('drafts', record, accountId);

      expect(mockCreate).not.toBeCalled();
      expect(mockPatch).toBeCalled();
    });
  });
});
