import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import { Address } from '../model';
import AddressController from './address-controller';
import Boom from '@hapi/boom';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockAddressClient = {
  getAddressByPostcode: jest.fn<(postcode: string) => Promise<Address[]>>(),
};

describe(AddressController, () => {
  const subject = new AddressController(mockAddressClient, new Logger());

  beforeEach(() => {
    mockAddressClient.getAddressByPostcode.mockClear();
  });

  describe('getAddressByPostcode', () => {
    it('forwards thrown Boom errors', async () => {
      const postcode = 'EC2N4AY';
      mockAddressClient.getAddressByPostcode.mockRejectedValue(Boom.teapot());

      const response = await subject.getAddressByPostcode({ postcode });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockAddressClient.getAddressByPostcode).toBeCalledWith(postcode);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the secrets manager', async () => {
      const postcode = 'EC2N4AY';
      mockAddressClient.getAddressByPostcode.mockResolvedValue([]);

      const response = await subject.getAddressByPostcode({ postcode });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockAddressClient.getAddressByPostcode).toHaveBeenCalledWith(
        postcode
      );
      expect(response.value).toEqual([]);
    });
  });
});
