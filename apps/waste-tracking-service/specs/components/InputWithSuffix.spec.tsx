import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputWithSuffix } from 'components';

describe('Input field with suffix', () => {
  const defaultProps = {
    id: 'test-id',
    testId: 'testId',
    name: 'test-name',
    label: 'Input label',
    suffix: 'suffix',
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
