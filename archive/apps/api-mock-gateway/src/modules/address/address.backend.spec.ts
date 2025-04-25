import { listAddresses } from './address.backend';
import { DB } from '../../db';
import { Address } from '@wts/api/waste-tracking-gateway';

describe('listAddresses', () => {
  let db: DB;
  let address: Address;

  beforeEach(() => {
    address = { postcode: 'AA1 1AA', addressLine1: '123 Test St' } as Address;
    db = { addresses: [address] } as DB;
  });

  it('returns an empty array when postcode is "aa11aa"', async () => {
    const result = await listAddresses(db, 'aa11aa', undefined);
    expect(result).toEqual([]);
  });

  it('returns the address when postcode is "AA11AA"', async () => {
    const result = await listAddresses(db, 'AA11AA', undefined);
    expect(result).toEqual([address]);
  });

  it('returns the address when building name or number matches', async () => {
    const result = await listAddresses(db, 'BB1 1BB', '123 Test St');
    expect(result).toEqual([address]);
  });

  it('returns all addresses when building name or number does not match', async () => {
    const result = await listAddresses(db, 'BB1 1BB', 'Nonexistent St');
    expect(result).toEqual([address]);
  });
});
