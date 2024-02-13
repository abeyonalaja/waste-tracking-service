import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header component', () => {
  test('renders header with testId', () => {
    const testTestId = 'pageHeader';
    render(<Header testId={testTestId} />);
    const footerElement = screen.getByTestId(testTestId);
    expect(footerElement).toBeTruthy();
  });
});
