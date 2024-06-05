import React from 'react';
import { render, fireEvent, act, screen } from 'jest-utils';
import '@testing-library/jest-dom';
import { InputWithSuffix } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('Input field with suffix', () => {
  const defaultProps = {
    id: 'test-id',
    testId: 'testId',
    name: 'test-name',
    label: 'Input label',
    suffix: 'suffix',
    maxLength: 250,
  };

  it('should render without errors', async () => {
    await act(async () => {
      render(<InputWithSuffix {...defaultProps} />);
    });
  });

  it('renders the label and suffix correctly', async () => {
    await act(async () => {
      render(<InputWithSuffix {...defaultProps} />);
    });

    expect(screen.getByText('Input label')).toBeInTheDocument();
    expect(screen.getByTestId('testId')).toHaveTextContent('suffix');
  });

  it('renders the hint text correctly', async () => {
    await act(async () => {
      render(<InputWithSuffix {...defaultProps} hint="Hint text" />);
    });
    expect(screen.getByText('Hint text')).toBeInTheDocument();
  });

  it('calls the onChange function when the input value changes', async () => {
    const handleChange = jest.fn();

    await act(async () => {
      render(<InputWithSuffix {...defaultProps} onChange={handleChange} />);
    });

    const input = screen.getByLabelText('Input label');

    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
