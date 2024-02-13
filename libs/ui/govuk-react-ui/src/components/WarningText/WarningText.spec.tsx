import React from 'react';
import { render, screen } from '@testing-library/react';
import { WarningText } from './WarningText';

describe('Warning Text component', () => {
  test('renders with text and testId', () => {
    const testText = 'Warning text';
    const testId = 'customTestId';
    render(<WarningText testId={testId}>{testText}</WarningText>);
    const element = screen.getByText(testText);
    expect(element).toBeTruthy();
  });
});
