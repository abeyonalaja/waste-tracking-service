import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import RecoveryFacility from 'pages/export/incomplete/treatment/recovery-facility-details';

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
  it('should render the page', async () => {
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

    const errorMessage = screen.getAllByText(
      'Enter the recovery facility name'
    )[0];
    expect(errorMessage).toBeTruthy();
  });

  it('should render contact details view', async () => {
    await act(async () => {
      render(<RecoveryFacility />);
    });

    const siteName = screen.getByLabelText('Facility name');
    const address = screen.getByLabelText('Address');
    const country = screen.getByLabelText(
      "CountryWe'll use this as the importing country. This cannot be the UK."
    );

    await act(async () => {
      fireEvent.change(siteName, { target: { value: 'site name' } });
      fireEvent.change(address, { target: { value: 'address' } });
      fireEvent.change(country, { target: { value: 'England' } });
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    await act(async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          json: () =>
            Promise.resolve({
              status: 'Started',
              values: [
                {
                  id: '132456689745',
                  addressDetails: {
                    name: 'name',
                    address: 'address',
                    country: 'country',
                  },
                  recoveryFacilityType: {
                    type: 'RecoveryFacility',
                    recoveryCode: '',
                  },
                },
              ],
            }),
        })
      );
    });

    expect(
      await screen.getByText(
        'What are the recovery facility’s contact details?'
      )
    ).toBeTruthy();
  });
});
