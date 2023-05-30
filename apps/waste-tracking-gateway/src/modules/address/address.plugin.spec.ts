import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import { AddressBackend } from './address.backend';
import addressPlugin from './address.plugin';
import Boom from '@hapi/boom';
import * as api from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockBackend = {
  listAddresses:
    jest.fn<
      (
        postcode: string,
        buildingNameOrNumber?: string
      ) => Promise<api.ListAddressesResponse>
    >(),
};

const app = server({
  host: 'localhost',
  port: 5000,
});

beforeAll(async () => {
  await app.register({
    plugin: addressPlugin,
    options: {
      backend: mockBackend as AddressBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/addresses',
    },
  });

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('AddressPlugin', () => {
  beforeEach(() => {
    mockBackend.listAddresses.mockClear();
  });

  describe('GET /addresses', () => {
    it('responds with 400 when no postcode is given as query parameter', async () => {
      const options = {
        method: 'GET',
        url: `/addresses`,
      };
      mockBackend.listAddresses.mockRejectedValue(Boom.badRequest);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
