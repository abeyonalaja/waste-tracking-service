import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import InterimSiteDetails from 'pages/export/incomplete/treatment/interim-site-details';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    json: () =>
      Promise.resolve({
        status: 'Started',
        values: [{ id: '123' }],
      }),
  })
);

describe('Interim site pages', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });
  });
  it('should render address view and show validation message if no content is entered', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });

    const addressField = screen.getByLabelText('Address');
    expect(addressField).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'Enter the interim site details'
    )[0];
    expect(errorMessage).toBeTruthy();
  });

  it('should render contact details view', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });

    const siteName = screen.getByLabelText('Interim site name');
    const address = screen.getByLabelText('Address');
    const country = screen.getByLabelText('Country');

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
                  status: 'Started',
                  values: [
                    {
                      id: '123',
                      addressDetails: {
                        name: 'site name',
                        address: 'address',
                        country: 'England',
                      },
                    },
                  ],
                },
              ],
            }),
        })
      );
    });

    expect(
      await screen.getByText('What are the interim site’s contact details?')
    ).toBeTruthy();
  });
});
