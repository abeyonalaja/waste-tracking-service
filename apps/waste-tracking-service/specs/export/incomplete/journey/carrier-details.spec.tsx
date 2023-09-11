import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import CarrierDetails from 'pages/export/incomplete/journey/carrier-details';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '12345', carrierId: '54321' },
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
          },
        ],
      }),
  })
);

describe('Waste carrier page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<CarrierDetails />);
    });
  });
});
