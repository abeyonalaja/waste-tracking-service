import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GridRow } from './GridRow';

describe('Grid Row component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<GridRow testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });

  test('renders with children and testId', () => {
    const testChildren = <span>Child element</span>;
    render(<GridRow>{testChildren}</GridRow>);
    const textElement = screen.getByText('Child element');
    expect(textElement).toBeTruthy();
  });

  test('applies correct class based on display prop', () => {
    render(<GridRow display="flex">Test Grid Row Flex</GridRow>);
    const element = screen.getByText('Test Grid Row Flex');
    expect(element).toHaveClass('grid-row-flex');

    render(
      <GridRow display="flex-from-tablet">Test Grid Row Flex Tablet</GridRow>,
    );
    const element2 = screen.getByText('Test Grid Row Flex Tablet');
    expect(element2).toHaveClass('grid-row-flex--from-tablet');
  });
});
