import React from 'react';
import { render } from 'jest-utils';
import '@testing-library/jest-dom';
import { Loading } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

test('renders Loading component', () => {
  const { getByTestId } = render(<Loading testId="loading-component" />);
  const loadingComponent = getByTestId('loading-component');
  expect(loadingComponent).toBeInTheDocument();
});
