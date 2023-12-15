import React from 'react';
import { render, screen, act } from 'jest-utils';
import HowToCreateCSV from 'pages/export/multiples/guidance/how-to-create-annex7-csv';

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
      render(<HowToCreateCSV />);
    });
    expect(
      screen.findByText(
        'Use this guidance to help you to complete a CSV template to upload'
      )
    ).toBeTruthy();
  });
});
