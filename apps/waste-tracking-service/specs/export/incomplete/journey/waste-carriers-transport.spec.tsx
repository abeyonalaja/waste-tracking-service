import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import WasteCarriers from 'pages/export/incomplete/journey/waste-carriers';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '12345' },
  })),
}));

global.fetch = jest.fn(() =>
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
  })
);

describe('Waste carrier transport means page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
  });

  it('should show validation messages if none radio is selected', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
    const submitButton = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const submitButton2 = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton2);
    });

    const submitButton3 = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton3);
    });

    const errorMessage = screen.getAllByText(
      'Select how the first waste carrier will transport the waste'
    )[0];
    expect(errorMessage).toBeTruthy();
  });

  it('should show the description page if radio is selected and form submitted', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
    const submitButton = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const submitButton2 = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton2);
    });
    const railRadio = screen.getByLabelText('Rail');
    fireEvent.click(railRadio);

    const submitButton3 = screen.getByText('Save and continue');
    await act(async () => {
      fireEvent.click(submitButton3);
    });

    const description = screen.getByLabelText('Enter details (optional)');
    expect(description).toBeTruthy();
  });
});
