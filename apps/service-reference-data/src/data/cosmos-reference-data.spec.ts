import { CosmosClient, Item, ItemResponse, Items } from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import ReferenceDataDraftRepository, {
  CacheItem,
} from './cosmos-reference-data';
import { LRUCache } from 'lru-cache';
import {
  Country,
  Pop,
  RecoveryCode,
  WasteCode,
  WasteCodeType,
  LocalAuthority,
} from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRead = jest.fn<typeof Item.prototype.read>();
const mockPatch = jest.fn<typeof Item.prototype.patch>();
const mockCreate = jest.fn<typeof Items.prototype.create>();

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
        },
      })),
    })),
  })),
}));

const mockCache = {
  get: jest.fn<(k: string) => boolean | undefined>(),
  set: jest.fn<
    (k: string, v: boolean) => LRUCache<string, CacheItem<unknown>>
  >(),
};

describe(ReferenceDataDraftRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockCache.get.mockClear();
    mockCache.set.mockClear();
  });

  const mockCosmosEndpoint = faker.datatype.string();
  const mockCosmosKey = faker.datatype.string();
  const mockCosmosDbName = faker.datatype.string();
  const mockCosmosContainerName = faker.datatype.string();
  const logger = new Logger();

  const subject = new ReferenceDataDraftRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    mockCosmosContainerName,
    mockCache as unknown as LRUCache<string, CacheItem<unknown>>,
    logger
  );

  describe('getList', () => {
    it('retrieves list of waste codes', async () => {
      const id = 'waste-codes';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              type: 'BaselAnnexIX',
              values: [
                {
                  code: 'B1010',
                  value: {
                    description: {
                      en: 'English Description',
                      cy: 'Welsh Description',
                    },
                  },
                },
              ],
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<WasteCodeType>(id);
      expect(result).toEqual([
        {
          type: 'BaselAnnexIX',
          values: [
            {
              code: 'B1010',
              value: {
                description: {
                  en: 'English Description',
                  cy: 'Welsh Description',
                },
              },
            },
          ],
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of EWC codes', async () => {
      const id = 'ewc-codes';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              code: '010101',
              value: {
                description: {
                  en: 'English Description',
                  cy: 'Welsh Description',
                },
              },
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<WasteCode>(id);
      expect(result).toEqual([
        {
          code: '010101',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of countries', async () => {
      const id = 'countries';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              name: 'Afghanistan [AF]',
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<Country>(id);
      expect(result).toEqual([
        {
          name: 'Afghanistan [AF]',
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of recovery codes', async () => {
      const id = 'recovery-codes';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              code: 'R1',
              value: {
                description: {
                  en: 'English Description',
                  cy: 'Welsh Description',
                },
                interim: false,
              },
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<RecoveryCode>(id);
      expect(result).toEqual([
        {
          code: 'R1',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
            interim: false,
          },
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of disposal codes', async () => {
      const id = 'disposal-codes';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              code: 'D1',
              value: {
                description: {
                  en: 'English Description',
                  cy: 'Welsh Description',
                },
              },
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<WasteCode>(id);
      expect(result).toEqual([
        {
          code: 'D1',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of hazardous codes', async () => {
      const id = 'hazardous-codes';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              code: 'HP1',
              value: {
                description: {
                  en: 'English Description',
                  cy: 'Welsh Description',
                },
              },
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<WasteCode>(id);
      expect(result).toEqual([
        {
          code: 'HP1',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of pops', async () => {
      const id = 'pops';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              name: {
                en: 'Endosulfan',
                cy: 'Endosulfan',
              },
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<Pop>(id);
      expect(result).toEqual([
        {
          name: {
            en: 'Endosulfan',
            cy: 'Endosulfan',
          },
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it('retrieves list of local-authorities', async () => {
      const id = 'local-authorities';
      const mockResponse = {
        id,
        value: {
          type: id,
          values: [
            {
              name: {
                en: 'Hartlepool',
                cy: 'Hartlepool',
              },
              country: {
                en: 'England',
                cy: 'Lloegr',
              },
            },
          ],
        },
        partitionKey: id,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getList<LocalAuthority>(id);
      expect(result).toEqual([
        {
          name: {
            en: 'Hartlepool',
            cy: 'Hartlepool',
          },
          country: {
            en: 'England',
            cy: 'Lloegr',
          },
        },
      ]);
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.datatype.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getList(id)).rejects.toThrow(Boom.notFound());
      expect(mockRead).toBeCalledTimes(1);
    });
  });
});
