import React from 'react';
import { act, fireEvent, render, screen } from 'jest-utils';
import WasteCode from 'pages/export/incomplete/about/waste-code';

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
    json: () => Promise.resolve({ status: 'NotStarted' }),
  })
);

describe('Waste code page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<WasteCode />);
    });
  });

  it('should show validation message no option is selected', async () => {
    await act(async () => {
      render(<WasteCode />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
