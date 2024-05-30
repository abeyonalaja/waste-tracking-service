import React from 'react';
import { act, render, screen } from 'jest-utils';
import '@testing-library/jest-dom';
import Custom404 from 'pages/404';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {},
        }),
    }) as Promise<Response>,
);

describe('Custom404', () => {
  test('renders without crashing', () => {
    act(() => {
      render(<Custom404 />);
    });
    expect(screen.findByText('Page not found')).toBeTruthy();
  });
});
