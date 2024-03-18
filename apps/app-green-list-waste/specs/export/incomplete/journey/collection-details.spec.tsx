import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import CollectionDetails from 'pages/incomplete/journey/collection-details';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

const defaultJsonResponse = { data: '123' };
const addressResponse = [
  {
    addressLine1: 'Hitachi Solutions',
    addressLine2: '110 Bishopsgate',
    townCity: 'LONDON',
    postcode: 'EC2N 4AY',
    country: 'England',
  },
  {
    addressLine1: 'Another address',
    addressLine2: '110 Bishopsgate',
    townCity: 'LONDON',
    postcode: 'EC2N 4AY',
    country: 'England',
  },
];
const selectedAddressResponse = {
  collectionDetail: {
    status: 'Started',
    address: {
      addressLine1: 'Hitachi Solutions',
      addressLine2: '110 Bishopsgate',
      townCity: 'LONDON',
      postcode: 'EC2N 4AY',
      country: 'England',
    },
  },
};

function setupFetchStub(data) {
  return function fetchStub() {
    return new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
  };
}

beforeEach(() => {
  global.fetch = jest
    .fn()
    .mockImplementation(setupFetchStub(defaultJsonResponse));
});

afterEach(() => {
  global.fetch.mockClear();
});

describe('Collection details page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<CollectionDetails />);
    });
  });

  it('should show validation message if no content is entered', async () => {
    await act(async () => {
      render(<CollectionDetails />);
    });

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a postcode');
    expect(errorMessage).toBeTruthy();
  });

  it('should show validation message if invalid postcode is entered', async () => {
    await act(async () => {
      render(<CollectionDetails />);
    });

    const postcode = screen.getByLabelText('Postcode');
    fireEvent.change(postcode, { target: { value: '123456' } });

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter a real postcode');
    expect(errorMessage).toBeTruthy();
  });

  it('should show radio list and validation if no option is selected', async () => {
    await act(async () => {
      render(<CollectionDetails />);
    });

    const postcode = screen.getByLabelText('Postcode');
    fireEvent.change(postcode, { target: { value: 'EC2N4AY' } });

    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(addressResponse));

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Save and continue')).toBeTruthy();

    const submitButtonSave = screen.getByText('Save and continue');
    fireEvent.click(submitButtonSave);

    const errorMessage = screen.getAllByText('Select an address')[0];
    expect(errorMessage).toBeTruthy();
  });

  it('selected an address and now reach the single address details', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(selectedAddressResponse));
    await act(async () => {
      render(<CollectionDetails />);
    });

    // Shows the manual address form, so need to click to continue
    const submitButtonSave = screen.getByText('Save and continue');
    fireEvent.click(submitButtonSave);

    // Find the first line of the address on the single address view
    expect(await screen.findByText('Hitachi Solutions')).toBeTruthy();
  });

  it('validation shows on the contact details when fields are empty', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(setupFetchStub(selectedAddressResponse));
    await act(async () => {
      render(<CollectionDetails />);
    });

    // Shows the manual address form, so need to click to continue
    const submitButtonSave = screen.getByText('Save and continue');
    fireEvent.click(submitButtonSave);

    // Find the first line of the address on the single address view
    expect(await screen.findByText('Hitachi Solutions')).toBeTruthy();

    // Find the continue button to carry on to contact details page
    const submitButtonSaveSingleAddress = screen.getByText('Save and continue');
    fireEvent.click(submitButtonSaveSingleAddress);

    // Find the continue button to carry on to trigger validation
    const submitButtonSaveContact = screen.getByText('Save and continue');
    fireEvent.click(submitButtonSaveContact);
    const errorMessage = screen.getAllByText('Enter an organisation name')[0];
    expect(errorMessage).toBeTruthy();
  });
});
