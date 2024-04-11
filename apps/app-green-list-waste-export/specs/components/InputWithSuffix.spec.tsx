import React from 'react';
import { render, fireEvent } from 'jest-utils';
import '@testing-library/jest-dom';
import { InputWithSuffix } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
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

  it('should render without errors', () => {
    render(<InputWithSuffix {...defaultProps} />);
  });

  it('renders the label and suffix correctly', () => {
    const { getByText, getByTestId } = render(
      <InputWithSuffix {...defaultProps} />
    );
    expect(getByText('Input label')).toBeInTheDocument();
    expect(getByTestId('testId')).toHaveTextContent('suffix');
  });

  it('renders the hint text correctly', () => {
    const { getByText } = render(
      <InputWithSuffix {...defaultProps} hint="Hint text" />
    );
    expect(getByText('Hint text')).toBeInTheDocument();
  });

  it('calls the onChange function when the input value changes', () => {
    const handleChange = jest.fn();
    const { getByLabelText } = render(
      <InputWithSuffix {...defaultProps} onChange={handleChange} />
    );
    const input = getByLabelText('Input label');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
