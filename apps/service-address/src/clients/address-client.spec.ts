import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import BoomiAddressClient from './address-client';
import axios from 'axios';

jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

describe(BoomiAddressClient, () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  const addressLookupUrl = faker.string.sample();
  const cert = Buffer.from(faker.string.sample(), 'base64');
  const key = Buffer.from(faker.string.sample(), 'base64');
  const subject = new BoomiAddressClient(
    new Logger(),
    addressLookupUrl,
    cert,
    key,
  );

  describe('getAddressByPostcode', () => {
    it('handles empty response', async () => {
      mockAxios.get.mockResolvedValue({
        data: undefined,
      });

      const postcode = 'EC2N4AY';

      expect(await subject.getAddressByPostcode(postcode)).toEqual([]);
    });
  });
});
