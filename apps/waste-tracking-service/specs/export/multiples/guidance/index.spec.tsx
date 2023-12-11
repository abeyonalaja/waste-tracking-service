import React from 'react';
import { render, screen, act } from 'jest-utils';
import Index from 'pages/export/multiples/guidance';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    push: () => {
      return;
    },
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('Guidance for multiples', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<Index />);
    });
    expect(
      screen.findByText('Creating multiple Annex VII records')
    ).toBeTruthy();
  });
});
