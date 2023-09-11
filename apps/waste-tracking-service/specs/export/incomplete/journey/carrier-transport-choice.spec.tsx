import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import CarrierTransportChoice from 'pages/export/incomplete/journey/carrier-transport-choice';

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

describe('Waste Carrier Transport Choice page', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<CarrierTransportChoice />);
    });
  });
});
