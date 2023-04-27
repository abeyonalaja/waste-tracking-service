import axios from 'axios';
import { DaprClient } from '@dapr/dapr';
import { findAddressByPostcode } from './addressLookup';
import winston from 'winston';

jest.mock('axios');

describe('Find address by postcode', () => {
  const logger = winston.createLogger({});
  it('Returns list of addresses when given a valid postcode', async () => {
    const postcode = 'AB12 3CD';
    const mockResponse = {
      data: {
        results: [
          {
            Address: {
              AddressLine: '123 Main St',
              SubBuildingName: '',
              BuildingName: '',
              Street: 'Main St',
              Town: 'Anytown',
              County: 'Anycountry',
              Postcode: postcode,
              Country: 'UK',
            },
          },
        ],
      },
      status: 200,
      headers: {},
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce(
      mockResponse
    );

    const daprClient = new DaprClient();
    const addresses = await findAddressByPostcode(postcode, daprClient, logger);

    expect(addresses).toBeDefined();
    expect(addresses).not.toBeNull();
    expect(Array.isArray(addresses)).toBe(true);
    expect(addresses?.length).toBeGreaterThan(0);
    if (addresses) {
      expect(addresses[0].Address).toBeDefined();
      expect(addresses[0].Address.Postcode).toBe(postcode);
    }
  });

  it('Returns error when given an invalid postcode', async () => {
    const postcode = 'invalid-postcode';
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(
      new Error('Bad Request')
    );

    const daprClient = new DaprClient();
    const addresses = await findAddressByPostcode(postcode, daprClient, logger);

    expect(addresses).toBeUndefined();
  });

  it('Returns error when postcode is not given', async () => {
    const postcode = '';
    const mockErrorResponse = {
      response: {
        status: 400,
        data: {
          message: 'Postcode is a required field',
        },
      },
    };
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(
      mockErrorResponse
    );

    const daprClient = new DaprClient();
    try {
      await findAddressByPostcode(postcode, daprClient, logger);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBe('Postcode is a required field');
    }
  });
});
