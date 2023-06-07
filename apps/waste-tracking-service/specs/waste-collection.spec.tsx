import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WasteCollection from '../pages/waste-collection';

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    query: { id: '123' },
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {
          carriers: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
        },
      }),
  })
);

describe('Waste Collection details page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<WasteCollection />);
    });
  });
  it('should show validation message if no content is entered', async () => {
    await act(async () => {
      render(<WasteCollection />);
    });

    const submitButton = screen.getByText('Find address');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
});
