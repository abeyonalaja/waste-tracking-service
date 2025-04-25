import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<Label testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    const testId = 'testId';
    render(<Label children={testChildren} testId={testId} />);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
