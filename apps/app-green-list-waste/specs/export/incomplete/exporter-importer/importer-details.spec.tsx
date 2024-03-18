import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import ImporterDetails from 'pages/incomplete/exporter-importer/importer-details';

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
          data: {},
        }),
    }) as Promise<Response>
);

describe('Importer details page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<ImporterDetails />);
    });
  });

  it('should show validation message if nothing entered', async () => {
    await act(async () => {
      render(<ImporterDetails />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
