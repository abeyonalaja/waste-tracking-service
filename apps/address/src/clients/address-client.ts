import Boom from '@hapi/boom';
import https from 'https';
import axios from 'axios';
import { Logger } from 'winston';
import {
  Address,
  GetAddressesResponse,
  GetAddressesErrorResponse,
} from '../model';

export interface AddressClient {
  getAddressByPostcode(postcode: string): Promise<Address[]>;
}

export default class BoomiAddressClient implements AddressClient {
  constructor(
    private logger: Logger,
    private addressLookupUrl: string,
    private cert: Buffer,
    private key: Buffer
  ) {}

  async getAddressByPostcode(postcode: string): Promise<Address[]> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        cert: this.cert,
        key: this.key,
      }),
      params: {
        postcode: postcode,
      },
    };

    try {
      const response = await axios.get(this.addressLookupUrl, options);
      const d = response.data as GetAddressesResponse;
      if (!d) {
        return [];
      }
      return d.results.map((r) => {
        return {
          addressLine1: r.Address.AddressLine,
          addressLine2: r.Address.AddressLine,
          townCity: r.Address.Town,
          postcode: r.Address.Postcode,
          country: r.Address.Country,
        };
      });
    } catch (err: any) {
      if (err.response) {
        const errData = err.response.data as GetAddressesErrorResponse;
        const boomErr = Boom.boomify(err, {
          statusCode: err.response.status,
          message: errData.error.message,
        });
        this.logger.error('Boomi API retruned unsuccessful response', {
          error: boomErr.message,
        });
        throw boomErr;
      } else if (err.request) {
        // Case untested
        const message = 'The client did not receive a response from Boomi';
        this.logger.error(message);
        throw Boom.boomify(err, { message });
      } else {
        this.logger.error('Boomi API Unknown error');
        throw Boom.internal();
      }
    }
  }
}
