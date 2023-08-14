import React from 'react';
import { render } from '@testing-library/react';
import { Address } from 'components';

describe('Address component', () => {
  const address = {
    addressLine1: 'Company name',
    addressLine2: '110 Bishopsgate',
    townCity: 'LONDON',
    postcode: 'EC2N 4AY',
    country: 'United Kingdom',
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
