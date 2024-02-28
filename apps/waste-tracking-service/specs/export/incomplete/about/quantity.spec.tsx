import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import Quantity from 'pages/export/incomplete/about/quantity';

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
          wasteQuantity: {
            status: 'NotStarted',
          },
        }),
    }) as Promise<Response>
);

describe('Quantity page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<Quantity />);
    });
  });

  it('should show validation message no option is selected', async () => {
    await act(async () => {
      render(<Quantity />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
