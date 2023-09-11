import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ExporterDetails from 'pages/export/incomplete/exporter-importer/exporter-details';

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
      Promise.resolve({
        status: 'Started',
        exporterAddress: {
          addressLine1: 'Hitachi Solutions',
          addressLine2: '110 Bishopsgate',
          townCity: 'LONDON',
          postcode: 'EC2N 4AY',
          country: 'United Kingdom',
        },
      }),
  })
);

describe('Exporter details page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ExporterDetails />);
    });
  });

  it('should display address details from the API', async () => {
    await act(async () => {
      render(<ExporterDetails />);
    });
    expect(await screen.findByText('EC2N 4AY')).toBeTruthy();
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
