import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WasteQuantity from '../pages/waste-quantity';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Waste quantity page', () => {
  it('should fetch the data when the component mounts', async () => {
    await act(async () => {
      render(<WasteQuantity />);
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
      render(<WasteQuantity />);
    });

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<WasteQuantity />);
    });

    expect(screen.getByText('No valid record found')).toBeTruthy();
  });

  it('should show validation message if no radio button is selected', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
    );

    await act(async () => {
      render(<WasteQuantity />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
