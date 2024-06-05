import React from 'react';
import { render, act, screen } from 'jest-utils';
import '@testing-library/jest-dom';
import { Loading } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

test('renders Loading component', async () => {
  await act(async () => {
    render(<Loading testId="loading-component" />);
  });

  const loadingComponent = screen.getByTestId('loading-component');

  expect(loadingComponent).toBeInTheDocument();
});
