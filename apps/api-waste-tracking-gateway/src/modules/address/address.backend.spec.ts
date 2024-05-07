import { AddressServiceBackend } from './address.backend';
import { DaprAddressClient } from '@wts/client/address';
import { Logger } from 'winston';
import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { GetAddressByPostcodeResponse } from '@wts/api/address';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClientAddresses = {
  getAddressByPostcode: jest.fn<DaprAddressClient['getAddressByPostcode']>(),
};

describe('AddressServiceBackend', () => {
  const subject = new AddressServiceBackend(
    mockClientAddresses as unknown as DaprAddressClient,
    new Logger()
  );

  beforeEach(() => {
    mockClientAddresses.getAddressByPostcode.mockClear();
  });

  it('should return addresses when response is successful', async () => {
    const mockResponse: GetAddressByPostcodeResponse = {
      success: true,
      value: [
        {
          addressLine1: 'Armira Capital Ltd',
          addressLine2: '110 Bishopsgate',
          townCity: 'LONDON',
          postcode: 'EC2N 4AY',
          country: 'England',
        },
      ],
    };

    mockClientAddresses.getAddressByPostcode.mockResolvedValue(mockResponse);

    const postcode = faker.address.zipCode();
    const result = await subject.listAddresses(postcode);

    expect(result).toEqual(mockResponse.value);
    expect(mockClientAddresses.getAddressByPostcode).toHaveBeenCalledWith({
      postcode,
    });
  });

  it('should throw an error when response is not successful', async () => {
    const mockResponse: GetAddressByPostcodeResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientAddresses.getAddressByPostcode.mockResolvedValue(mockResponse);

    const postcode = faker.address.zipCode();
    await expect(subject.listAddresses(postcode)).rejects.toThrow();
    expect(mockClientAddresses.getAddressByPostcode).toHaveBeenCalledWith({
      postcode,
    });
  });
});
