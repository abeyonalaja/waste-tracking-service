import Boom from '@hapi/boom';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { AddressClient } from '../clients/address-client';
import {
  GetAddressByPostcodeRequest,
  GetAddressByPostcodeResponse,
} from '../model';
import FuzzySearch from 'fuzzy-search';

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (s) {
      return s.replace(s[0], s[0].toUpperCase());
    })
    .join(' ');
}

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;

export default class AddressController {
  constructor(private addressClient: AddressClient, private logger: Logger) {}

  getAddressByPostcode: Handler<
    GetAddressByPostcodeRequest,
    GetAddressByPostcodeResponse
  > = async ({ postcode, buildingNameOrNumber }) => {
    try {
      const addressResults = await this.addressClient.getAddressByPostcode(
        postcode
      );

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
        }
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
