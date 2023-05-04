import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RadiosDivider } from '../../components/';

describe('RadiosDivider', () => {
  it('renders children', () => {
    const { getByText } = render(<RadiosDivider>Test Content</RadiosDivider>);
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with data-testid attribute when provided', () => {
    const { getByTestId } = render(<RadiosDivider testId="test-id" />);
    expect(getByTestId('test-id')).toBeInTheDocument();
  });

  it('renders with default styles', () => {
    const { container } = render(<RadiosDivider />);
    expect(container.firstChild).toHaveStyle(`
      width: 40px;
      margin-bottom: 10px;
      text-align: center;
    `);
  });
});
