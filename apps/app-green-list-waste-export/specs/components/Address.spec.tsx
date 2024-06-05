import React from 'react';
import { render, screen, act } from 'jest-utils';
import { Address } from 'components/Address';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);
const address = {
  addressLine1: 'Company name',
  addressLine2: '110 Bishopsgate',
  townCity: 'LONDON',
  postcode: 'EC2N 4AY',
  country: 'England',
};

describe('Address component', () => {
  it('renders the address correctly', async () => {
    await act(async () => {
      render(<Address address={address} />);
    });

    expect(screen.getByText(address.addressLine1)).toBeTruthy();
    expect(screen.getByText(address.addressLine2)).toBeTruthy();
    expect(screen.getByText(address.townCity)).toBeTruthy();
    expect(screen.getByText(address.postcode)).toBeTruthy();
    expect(screen.getByText(address.country)).toBeTruthy();
  });
});
