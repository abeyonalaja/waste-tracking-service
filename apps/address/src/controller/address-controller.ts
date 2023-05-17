import Boom from '@hapi/boom';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { AddressClient } from '../clients/address-client';
import {
  GetAddressByPostcodeRequest,
  GetAddressByPostcodeResponse,
} from '../model';

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;

export default class AddressController {
  constructor(private addressClient: AddressClient, private logger: Logger) {}

  getAddressByPostcode: Handler<
    GetAddressByPostcodeRequest,
    GetAddressByPostcodeResponse
  > = async ({ postcode }) => {
    try {
      return success(await this.addressClient.getAddressByPostcode(postcode));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
