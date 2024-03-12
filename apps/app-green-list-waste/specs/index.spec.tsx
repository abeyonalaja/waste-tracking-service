import React from 'react';
import { render, screen, act } from 'jest-utils';
import Index from 'pages/index';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {},
        }),
    }) as Promise<Response>
);

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

describe('Landing page', () => {
  it('should render successfully', () => {
    act(() => {
      render(<Index />);
    });
    expect(screen.findByText('Export waste from the UK')).toBeTruthy();
  });
});
