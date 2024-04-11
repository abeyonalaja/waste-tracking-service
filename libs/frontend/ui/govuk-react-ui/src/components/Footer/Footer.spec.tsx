import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer component', () => {
  test('renders footer with testId', () => {
    const testId = 'pageFooter';
    render(<Footer testId={testId} />);
    const footerElement = screen.getByTestId(testId);
    expect(footerElement).toBeTruthy();
  });
});
