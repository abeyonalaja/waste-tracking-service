import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormGroup } from './FormGroup';

describe('Form Group component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<FormGroup testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    const testId = 'testId';
    render(<FormGroup children={testChildren} testId={testId} />);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });
});
