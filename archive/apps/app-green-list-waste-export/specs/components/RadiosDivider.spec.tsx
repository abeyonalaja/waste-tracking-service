import React from 'react';
import { render, screen, act } from 'jest-utils';
import '@testing-library/jest-dom';
import { RadiosDivider } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('RadiosDivider', () => {
  it('renders children', async () => {
    await act(async () => {
      render(<RadiosDivider>Test Content</RadiosDivider>);
    });

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with data-testid attribute when provided', async () => {
    await act(async () => {
      render(<RadiosDivider testId="test-id" />);
    });

    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('renders with default styles', async () => {
    let container: HTMLElement;

    await act(async () => {
      container = render(<RadiosDivider />).container;
    });

    expect(container.firstChild).toHaveStyle(`
      width: 40px;
      margin-bottom: 10px;
      text-align: center;
    `);
  });
});
