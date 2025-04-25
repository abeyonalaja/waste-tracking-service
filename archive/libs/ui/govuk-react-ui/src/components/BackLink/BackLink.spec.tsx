import React from 'react';
import { render, screen } from '@testing-library/react';
import { BackLink } from './BackLink';

describe('Back Link component', () => {
  test('renders with text and testId', () => {
    const testText = 'Click me';
    const testId = 'customTestId';
    render(<BackLink text={testText} testId={testId} href="test" />);
    const buttonElement = screen.getByText(testText);
    expect(buttonElement).toBeTruthy();
  });
});
