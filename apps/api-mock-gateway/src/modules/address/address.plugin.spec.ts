import AddressPlugin from './address.plugin';
import * as jsonServer from 'json-server';
import { db } from '../../db';
import { BadRequestError } from '../../lib/errors';

jest.mock('../../db');

const server = jsonServer.create();

describe('AddressPlugin', () => {
  let plugin: AddressPlugin;

  beforeEach(async () => {
    plugin = new AddressPlugin(server, '/api/addresses', db);
  });

  describe('register', () => {
    it('should respond with 400 when no postcode is given as query parameter', async () => {
      const mockGet = jest.fn();
      const mockJson = jest.fn();
      const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

      plugin['server'].get = mockGet;

      await plugin.register();

      const handler = mockGet.mock.calls[0][1];
      await handler({ query: {} }, { status: mockStatus });

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(
        new BadRequestError("Missing query parameter 'postcode'")
      );
    });
  });
});
