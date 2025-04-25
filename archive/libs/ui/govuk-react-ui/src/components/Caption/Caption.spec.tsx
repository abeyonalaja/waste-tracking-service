import React from 'react';
import { render, screen } from '@testing-library/react';
import { Caption } from './Caption';

describe('Caption component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<Caption testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <em>Child element</em>;
    const testId = 'testId';
    render(<Caption children={testChildren} testId={testId} />);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
