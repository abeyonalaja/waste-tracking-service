import React from 'react';
import { render, screen } from '@testing-library/react';
import { WidthContainer } from './WidthContainer';

describe('Width Container component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<WidthContainer testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    const testId = 'testId';
    render(<WidthContainer children={testChildren} testId={testId} />);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
