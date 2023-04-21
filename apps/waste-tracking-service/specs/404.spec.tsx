import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Custom404 from '../pages/404';

describe('Custom404', () => {
  test('renders without crashing', () => {
    const { getByText } = render(<Custom404 />);
    expect(getByText('Page not found')).toBeInTheDocument();
  });
});
