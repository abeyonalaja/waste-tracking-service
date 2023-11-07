import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import WasteCarriers from 'pages/export/incomplete/journey/waste-carriers';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '1234567890' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        status: 'Complete',
        transport: true,
        values: [
          {
            id: '1111111111',
            addressDetails: {
              organisationName: 'TestWasteCarrier1',
              address: 'test',
              country: 'test',
            },
            contactDetails: {
              fullName: 'test',
              emailAddress: 'test@test.com',
              phoneNumber: '07777123456',
              faxNumber: '',
            },
            transportDetails: {
              type: 'Rail',
            },
          },
          {
            id: '22222222222',
            addressDetails: {
              organisationName: 'TestWasteCarrier2',
              address: 'test',
              country: 'test',
            },
            contactDetails: {
              fullName: 'test',
              emailAddress: 'test@test.com',
              phoneNumber: '07777123456',
              faxNumber: '',
            },
            transportDetails: {
              type: 'Rail',
            },
          },
          {
            id: '3333333333',
            addressDetails: {
              organisationName: 'TestWasteCarrier3',
              address: 'test',
              country: 'test',
            },
            contactDetails: {
              fullName: 'test',
              emailAddress: 'test@test.com',
              phoneNumber: '07777123456',
              faxNumber: '',
            },
            transportDetails: {
              type: 'Rail',
            },
          },
        ],
      }),
  })
);

describe('Waste carriers page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
  });

  it('should show the list page on load', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
    const pageHeading = screen.getByText('Your added carriers');
    expect(pageHeading).toBeTruthy();
  });

  it('should show the correct address page when the change link is clicked', async () => {
    await act(async () => {
      render(<WasteCarriers />);
    });
    const pageHeading = screen.getByText('Your added carriers');
    expect(pageHeading).toBeTruthy();

    const secondChangeLink = screen.getAllByText('Change')[1];
    expect(secondChangeLink).toBeTruthy();

    await act(async () => {
      fireEvent.click(secondChangeLink);
    });

    const secondAddressPageTitle = screen.getByText(
      'Who is the second waste carrier?'
    );
    expect(secondAddressPageTitle).toBeTruthy();
  });
});
