import React from 'react';
import { render, screen } from '@testing-library/react';
import { InsetText } from './InsetText';

describe('Inset Text component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<InsetText testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    const testId = 'testId';
    render(<InsetText children={testChildren} testId={testId} />);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
