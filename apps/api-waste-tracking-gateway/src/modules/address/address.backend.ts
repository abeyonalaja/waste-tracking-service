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
