import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import RecoveryFacility from '../pages/recovery-facility-details';
import WasteCollection from '../pages/waste-collection';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({ status: 'Started', values: [{ id: '987654321' }] }),
  })
);

describe('Recovery facilities pages', () => {
  it('should fetch the data when the page loads', async () => {
    await act(async () => {
      render(<RecoveryFacility />);
    });
  });

  it('should render address view and show validation message if no content is entered', async () => {
    await act(async () => {
      render(<RecoveryFacility />);
    });

    const addressField = screen.getByLabelText('Address');
    expect(addressField).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should render contact view and show validation message if no content is entered', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'Started',
            values: [
              {
                id: '987654321',
                addressDetails: {
                  name: 'name',
                  address: 'address',
                  country: 'country',
                },
              },
            ],
          }),
      })
    );

    await act(async () => {
      render(<RecoveryFacility />);
    });

    const emailField = screen.getByLabelText('Email address');
    expect(emailField).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should render recovery code view and show validation message if no content is entered', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'Started',
            values: [
              {
                id: '987654321',
                addressDetails: {
                  name: 'name',
                  address: 'address',
                  country: 'country',
                },
                contactDetails: {
                  fullName: 'Full name',
                  emailAddress: 'test@email.com',
                  phoneNumber: '07733777222',
                },
              },
            ],
          }),
      })
    );

    await act(async () => {
      render(<RecoveryFacility />);
    });

    const selectField = screen.getByLabelText(
      'Choose from the list or start typing'
    );
    expect(selectField).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
