import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loading } from '../../components/';

test('renders Loading component', () => {
  const { getByTestId } = render(<Loading testId="loading-component" />);
  const loadingComponent = getByTestId('loading-component');
  expect(loadingComponent).toBeInTheDocument();
});
