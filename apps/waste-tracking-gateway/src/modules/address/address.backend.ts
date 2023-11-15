import Boom from '@hapi/boom';
import { GetAddressByPostcodeResponse } from '@wts/api/address';
import * as api from '@wts/api/waste-tracking-gateway';
import { DaprAddressClient } from '@wts/client/address';
import { Logger } from 'winston';

export interface AddressBackend {
  listAddresses(
    postcode: string,
    buildingNameOrNumber?: string
  ): Promise<api.ListAddressesResponse>;
}

/**
 * This is a stub backend and should not be used in production.
 */
export class AddressStub implements AddressBackend {
  async listAddresses(postcode?: string): Promise<api.ListAddressesResponse> {
    if (postcode === 'AA11AA') {
      return [
        {
          addressLine1: 'Single Address Result',
          addressLine2: '110 Bishopsgate',
          townCity: 'LONDON',
          postcode: 'EC2N 4AY',
          country: 'England',
        },
      ];
    }
    return [
      {
        addressLine1: 'Armira Capital Ltd',
        addressLine2: '110 Bishopsgate',
        townCity: 'LONDON',
        postcode: 'EC2N 4AY',
        country: 'England',
      },
      {
        addressLine1: 'Autonomy Capital Research LLP',
        addressLine2: '110 Bishopsgate',
        townCity: 'LONDON',
        postcode: 'EC2N 4AY',
        country: 'England',
      },
      {
        addressLine1: 'B A S F Metals',
        addressLine2: '110 Bishopsgate',
        townCity: 'LONDON',
        postcode: 'EC2N 4AY',
        country: 'England',
      },
    ] as unknown as api.ListAddressesResponse;
  }
}

export class AddressServiceBackend implements AddressBackend {
  constructor(private client: DaprAddressClient, private logger: Logger) {}

  async listAddresses(
    postcode: string,
    buildingNameOrNumber?: string
  ): Promise<api.ListAddressesResponse> {
    let response: GetAddressByPostcodeResponse;
    try {
      response = await this.client.getAddressByPostcode({
        postcode,
        buildingNameOrNumber,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }
}
