import React from 'react';
import { render, screen } from '@testing-library/react';
import { GridCol } from './GridCol';

describe('Grid Column component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<GridCol testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    const testId = 'testId';
    render(<GridCol children={testChildren} testId={testId} />);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
