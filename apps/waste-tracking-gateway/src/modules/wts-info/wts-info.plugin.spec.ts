import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import addressPlugin from './wts-info.plugin';
import Boom from '@hapi/boom';
import * as api from '@wts/api/waste-tracking-gateway';
import { WTSInfoBackend } from './wts-info.backend';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockBackend = {
  listWasteCodes:
    jest.fn<(type: string) => Promise<api.ListWasteCodesResponse>>(),
  listEWCCodes: jest.fn<() => Promise<api.ListEWCCodesResponse>>(),
  listCountries: jest.fn<() => Promise<api.ListCountriesResponse>>(),
  listRecoveryCodes: jest.fn<() => Promise<api.ListRecoveryCodesResponse>>(),
  listDisposalCodes: jest.fn<() => Promise<api.ListDisposalCodesResponse>>(),
};

const app = server({
  host: 'localhost',
  port: 5000,
});

beforeAll(async () => {
  await app.register({
    plugin: addressPlugin,
    options: {
      backend: mockBackend as WTSInfoBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/wts-info',
    },
  });

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('DataPlugin', () => {
  beforeEach(() => {
    mockBackend.listWasteCodes.mockClear();
  });

  describe('GET /wts-info/waste-codes?language=ie', () => {
    it('responds with 400 when language is unsupported', async () => {
      const options = {
        method: 'GET',
        url: `/wts-info/waste-codes?language=ie`,
      };
      mockBackend.listWasteCodes.mockRejectedValue(Boom.badRequest);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
