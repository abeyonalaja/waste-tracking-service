import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import WasteTransitCountries from '../pages/waste-transit-countries';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
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
      render(<WasteTransitCountries />);
    });
  });

  it('should display a loading message while data is being fetched', async () => {
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          return;
        })
    );

    await act(async () => {
      render(<WasteTransitCountries />);
    });

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<WasteTransitCountries />);
    });

    expect(
      screen.getByText('The export record has not been found')
    ).toBeTruthy();
  });

  it('should show validation message if no radio is selected', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'NotStarted' }),
      })
    );

    await act(async () => {
      render(<WasteTransitCountries />);
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
      render(<WasteTransitCountries />);
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
      render(<WasteTransitCountries />);
    });

    const country = screen.getByText('1. England');
    expect(country).toBeTruthy();

    const pageTitle = screen.getByText('Waste transit countries');
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation message if selected YES to additional country and do not select a country', async () => {
    await act(async () => {
      render(<WasteTransitCountries />);
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
      render(<WasteTransitCountries />);
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
      render(<WasteTransitCountries />);
    });

    const removeLink = screen.getByText('Remove');
    fireEvent.click(removeLink);

    const pageTitle = screen.getByText(
      'Are you sure you want to remove England?'
    );
    expect(pageTitle).toBeTruthy();
  });
});
