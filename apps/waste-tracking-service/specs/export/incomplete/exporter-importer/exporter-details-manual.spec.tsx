import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ExporterDetailsManual from 'pages/export/incomplete/exporter-importer/exporter-details-manual';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        status: 'NotStarted',
      }),
  })
);

describe('Exporter details manual address page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ExporterDetailsManual />);
    });
  });

  it('should show validation messages if nothing entered', async () => {
    await act(async () => {
      render(<ExporterDetailsManual />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText('Enter an address')[0];
    expect(errorMessage).toBeTruthy();
  });
});
