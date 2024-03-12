import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import WasteCarriers from 'pages/export/incomplete/journey/waste-carriers';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '12345', carrierId: '54321' },
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
          transport: true,
          values: [
            {
              id: '54321',
              addressDetails: {
                organisationName: 'test',
                address: 'test',
                country: 'test',
              },
              contactDetails: {
                fullName: 'test',
                emailAddress: 'test@test.com',
                phoneNumber: '07777123456',
                faxNumber: '',
              },
              transportDetails: {},
            },
          ],
        }),
    }) as Promise<Response>
);

describe('Waste carriers page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
  });

  it('should show the address page on load', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
    const pageHeading = screen.getByText('Who is the first waste carrier?');
    expect(pageHeading).toBeTruthy();
  });

  it('should show the contact page if address page passes validation', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });

    const submitButton = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const pageHeading = screen.getByText(
      "What are the first waste carrier's contact details?"
    );
    expect(pageHeading).toBeTruthy();
  });
});
