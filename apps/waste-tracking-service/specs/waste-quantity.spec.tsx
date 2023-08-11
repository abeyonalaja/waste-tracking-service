import React from 'react';
import { act, render, screen } from '../jest-utils';
import '@testing-library/jest-dom';
import WasteQuantity from '../pages/export/waste-quantity';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({ data: { wasteQuantity: { status: 'NotStarted' } } }),
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

    expect(screen.findByText('Loading')).toBeTruthy();
  });

  it('should display an error message if the data fetching fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

    await act(async () => {
      render(<WasteQuantity />);
    });

    expect(
      screen.findByText('The export record has not been found')
    ).toBeTruthy();
  });
});
