import React from 'react';
import { render, screen, act } from 'jest-utils';
import Bounce from 'pages/export/multiples/guidance/bounce';

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

describe('Guidance bounce for multiples', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<Bounce />);
    });
    expect(
      screen.findByText(
        'Use this guidance to help you to complete a CSV template to upload multiple Annex VII records from the template'
      )
    ).toBeTruthy();
  });
});
