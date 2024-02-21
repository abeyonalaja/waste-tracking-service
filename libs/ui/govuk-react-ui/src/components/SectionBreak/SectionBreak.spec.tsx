import React from 'react';
import { render, screen } from '@testing-library/react';
import { SectionBreak } from './SectionBreak';

describe('Section Break component', () => {
  test('renders with testId', () => {
    const testId = 'testId';
    render(<SectionBreak testId={testId} />);
    const element = screen.getByTestId(testId);
    expect(element).toBeTruthy();
  });
});
