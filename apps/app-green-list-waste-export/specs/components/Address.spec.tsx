import React from 'react';
import { render } from 'jest-utils';
import { Address } from 'components/Address';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Address component', () => {
  const address = {
    addressLine1: 'Company name',
    addressLine2: '110 Bishopsgate',
    townCity: 'LONDON',
    postcode: 'EC2N 4AY',
    country: 'England',
  };

  it('renders the address correctly', () => {
    const { getByText } = render(<Address address={address} />);

    expect(getByText(address.addressLine1)).toBeTruthy();
    expect(getByText(address.addressLine2)).toBeTruthy();
    expect(getByText(address.townCity)).toBeTruthy();
    expect(getByText(address.postcode)).toBeTruthy();
    expect(getByText(address.country)).toBeTruthy();
  });
});
