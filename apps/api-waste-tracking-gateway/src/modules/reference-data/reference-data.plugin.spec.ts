import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import referenceDataPlugin from './reference-data.plugin';
import * as api from '@wts/api/waste-tracking-gateway';
import { ReferenceDataBackend } from './reference-data.backend';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockBackend = {
  listWasteCodes: jest.fn<() => Promise<api.ListWasteCodesResponse>>(),
  listEWCCodes: jest.fn<() => Promise<api.ListEWCCodesResponse>>(),
  listCountries: jest.fn<() => Promise<api.ListCountriesResponse>>(),
  listRecoveryCodes: jest.fn<() => Promise<api.ListRecoveryCodesResponse>>(),
  listDisposalCodes: jest.fn<() => Promise<api.ListDisposalCodesResponse>>(),
  listHazardousCodes: jest.fn<() => Promise<api.ListHazardousCodesResponse>>(),
  listPops: jest.fn<() => Promise<api.ListPopsResponse>>(),
  listLocalAuthorities:
    jest.fn<() => Promise<api.ListlocalAuthoritiesResponse>>(),
};

const app = server({
  host: 'localhost',
  port: 3004,
});

beforeAll(async () => {
  await app.register({
    plugin: referenceDataPlugin,
    options: {
      backend: mockBackend as ReferenceDataBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/reference-data',
    },
  });

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('Reference Data Plugin', () => {
  beforeEach(() => {
    mockBackend.listWasteCodes.mockClear();
  });

  describe('POST /reference-data/waste-codes', () => {
    it('Expect 404 as POSTing instead of GETting waste codes', async () => {
      const options = {
        method: 'POST',
        url: `/reference-data/waste-codes`,
      };
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
