import { DB } from '../../db';
import FuzzySearch from 'fuzzy-search';
import {
  Address,
  ListAddressesResponse,
} from '@wts/api/waste-tracking-gateway';

export async function listAddresses(
  db: DB,
  postcode: string,
  buildingNameOrNumber: string | undefined,
): Promise<ListAddressesResponse> {
  if (postcode === 'aa11aa') {
    return [];
  }
  if (postcode === 'AA11AA') {
    const address = db.addresses.find(
      (a: Address) => a.postcode === 'AA1 1AA',
    ) as Address;
    return [address];
  }

  const addresses: ListAddressesResponse = db.addresses;

  if (!buildingNameOrNumber) {
    return addresses;
  }

  const searcher = new FuzzySearch(addresses, ['addressLine1'], {
    caseSensitive: false,
  });
  const filteredAddressResults = searcher.search(buildingNameOrNumber);

  if (filteredAddressResults.length !== 0) {
    return filteredAddressResults;
  }

  return addresses;
}
