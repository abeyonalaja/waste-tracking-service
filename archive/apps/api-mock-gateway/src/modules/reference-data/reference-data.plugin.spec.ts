import ReferenceDataPlugin from './reference-data.plugin';
import { db } from '../../db';
import * as jsonServer from 'json-server';

jest.mock('../../db');
jest.mock('./reference-data.backend', () => ({
  listWasteCodes: jest.fn().mockResolvedValue([]),
}));
const server = jsonServer.create();
describe('ReferenceDataPlugin', () => {
  let plugin: ReferenceDataPlugin;

  beforeEach(async () => {
    plugin = new ReferenceDataPlugin(server, '/reference-data', db);
  });

  it('Expect POSTing instead of GETting waste codes to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/waste-codes',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting ewc codes to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/ewc-codes',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting countries to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/countries',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting recovery codes to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/recovery-codes',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting disposal codes to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/disposal-codes',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting hazardous codes to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/hazardous-codes',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting pops to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/pops',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting Local Authorities to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/local-authorities',
      expect.any(Function),
    );
  });

  it('Expect POSTing instead of GETting SIC Codes to not be allowed', async () => {
    const mockPost = jest.fn();
    server.post = mockPost;
    await plugin.register();
    expect(mockPost).not.toHaveBeenCalledWith(
      '/reference-data/sic-codes',
      expect.any(Function),
    );
  });
});
