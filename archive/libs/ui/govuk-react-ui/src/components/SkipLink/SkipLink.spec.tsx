import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkipLink } from './SkipLink';

describe('Skip Link component', () => {
  test('renders with text and testId', () => {
    const testText = 'Click me';
    const testId = 'customTestId';
    render(<SkipLink text={testText} testId={testId} />);
    const buttonElement = screen.getByText(testText);
    expect(buttonElement).toBeTruthy();
  });

  test('renders with custom text and testId', () => {
    const testId = 'customTestId';
    const testText = 'Skip to main homepage';
    render(<SkipLink text={testText} testId={testId} />);
    const buttonElement = screen.getByText(testText);
    expect(buttonElement).toBeTruthy();
  });
});
