import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import TransitCountries from 'pages/export/incomplete/journey/transit-countries';

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

describe('Waste Transit Countries page', () => {
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<TransitCountries />);
    });
  });

  it('should show validation message if no radio is selected', async () => {
    await act(async () => {
      render(<TransitCountries />);
    });

    const pageTitle = screen.getByText(
      'Are there any other countries the waste will travel through?'
    );
    expect(pageTitle).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if selected YES and do not select a country', async () => {
    await act(async () => {
      render(<TransitCountries />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show list page if countries are returned from the API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ status: 'Complete', values: ['England'] }),
      })
    );

    await act(async () => {
      render(<TransitCountries />);
    });

    const country = screen.getByText('1. England');
    expect(country).toBeTruthy();

    const pageTitle = screen.getByText('Waste transit countries');
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation message if selected YES to additional country and do not select a country', async () => {
    await act(async () => {
      render(<TransitCountries />);
    });

    const yesRadioLabel = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioLabel);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show change view when change link is clicked', async () => {
    await act(async () => {
      render(<TransitCountries />);
    });

    const changeLink = screen.getByText('Change');
    fireEvent.click(changeLink);

    const pageTitle = screen.getByText(
      'What would you like to change England to?'
    );
    expect(pageTitle).toBeTruthy();
  });

  it('should show confirm view when remove link is clicked', async () => {
    await act(async () => {
      render(<TransitCountries />);
    });

    const removeLink = screen.getByText('Remove');
    fireEvent.click(removeLink);

    const pageTitle = screen.getByText(
      'Are you sure you want to remove England?'
    );
    expect(pageTitle).toBeTruthy();
  });
});
