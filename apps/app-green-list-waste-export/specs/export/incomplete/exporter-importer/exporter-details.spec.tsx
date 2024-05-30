import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ExporterDetails from 'pages/incomplete/exporter-importer/exporter-details';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          status: 'Started',
          exporterAddress: {
            addressLine1: 'Hitachi Solutions',
            addressLine2: '110 Bishopsgate',
            townCity: 'LONDON',
            postcode: 'EC2N 4AY',
            country: 'England',
          },
        }),
    }) as Promise<Response>,
);

describe('Exporter details page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ExporterDetails />);
    });
  });

  it('should show validation messages if nothing entered', async () => {
    await act(async () => {
      render(<ExporterDetails />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter an organisation name')[0];
    expect(errorMessage).toBeTruthy();
  });
});
