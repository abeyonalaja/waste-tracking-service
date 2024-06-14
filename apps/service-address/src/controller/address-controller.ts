import Boom from '@hapi/boom';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { AddressClient } from '../clients/address-client';
import {
  GetAddressByPostcodeRequest,
  GetAddressByPostcodeResponse,
} from '@wts/api/address';
import FuzzySearch from 'fuzzy-search';
import { Address } from '@wts/api/address';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (s) {
      return s.replace(s[0], s[0].toUpperCase());
    })
    .join(' ');
}

export default class AddressController {
  constructor(
    private addressClient: AddressClient,
    private logger: Logger,
  ) {}

  getAddressByPostcode: Handler<
    GetAddressByPostcodeRequest,
    GetAddressByPostcodeResponse
  > = async ({
    postcode,
    buildingNameOrNumber,
  }): Promise<
    | {
        success: false;
        error: { statusCode: number; name: string; message: string };
      }
    | {
        success: true;
        value: Address[];
      }
  > => {
    try {
      const addressResults =
        await this.addressClient.getAddressByPostcode(postcode);

      const reformattedAddressResults = addressResults.map((a) => {
        return {
          addressLine1: titleCase(a.addressLine1),
          addressLine2: !a.addressLine2 ? undefined : titleCase(a.addressLine2),
          townCity: titleCase(a.townCity),
          postcode: a.postcode,
          country: titleCase(a.country),
        };
      });

      if (!buildingNameOrNumber) {
        return success(reformattedAddressResults);
      }

      const searcher = new FuzzySearch(
        reformattedAddressResults,
        ['addressLine1'],
        {
          caseSensitive: false,
        },
      );
      const filteredAddressResults = searcher.search(buildingNameOrNumber);

      if (filteredAddressResults.length !== 0) {
        return success(filteredAddressResults);
      }

      return success(reformattedAddressResults);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
