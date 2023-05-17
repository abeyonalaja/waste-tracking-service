import { AddressStub } from './address.backend';

describe(AddressStub, () => {
  let subject: AddressStub;

  beforeEach(() => {
    subject = new AddressStub();
  });

  it('returns a list of addresses', async () => {
    const addresses = await subject.listAddresses();
    expect(addresses).toHaveLength(3);
    expect(addresses[0]).toHaveProperty('addressLine1', 'Armira Capital Ltd');
    expect(addresses[1]).toHaveProperty(
      'addressLine1',
      'Autonomy Capital Research LLP'
    );
    expect(addresses[2]).toHaveProperty('addressLine1', 'B A S F Metals');
  });
});
