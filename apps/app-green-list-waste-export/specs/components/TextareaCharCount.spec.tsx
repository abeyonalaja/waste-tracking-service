import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TextareaCharCount } from 'components';
import 'i18n/config';

describe('Character count textarea component', () => {
  const defaultProps = {
    id: 'test-id',
    name: 'test-name',
    charCount: 100,
    children: 'Test label',
  };

  it('should render without errors', () => {
    render(<TextareaCharCount {...defaultProps} />);
  });

  it('should display the label', () => {
    const { getByLabelText } = render(<TextareaCharCount {...defaultProps} />);
    const labelElement = getByLabelText('Test label');
    expect(labelElement).toBeTruthy();
  });

  it('should display the hint text', () => {
    const { getByText } = render(
      <TextareaCharCount {...defaultProps} hint="Test Hint" />
    );
    const hintElement = getByText('Test Hint');
    expect(hintElement).toBeTruthy();
  });

  it('should display the character count message', () => {
    const { getByText } = render(<TextareaCharCount {...defaultProps} />);
    const messageElement = getByText('You have 100 characters remaining');
    expect(messageElement).toBeTruthy();
  });

  it('should update the character count when typing', () => {
    const { getByLabelText, getByText } = render(
      <TextareaCharCount {...defaultProps} />
    );
    const textareaElement = getByLabelText('Test label');
    fireEvent.change(textareaElement, { target: { value: 'test value' } });
    const messageElement = getByText('You have 90 characters remaining');
    expect(messageElement).toBeTruthy();
  });

  it('should display an error message when the character count exceeds the limit', () => {
    const { getByLabelText, getByText } = render(
      <TextareaCharCount {...defaultProps} />
    );
    const textareaElement = getByLabelText('Test label');
    fireEvent.change(textareaElement, { target: { value: 'a'.repeat(101) } });
    const messageElement = getByText('You have 1 character too many');
    expect(messageElement).toBeTruthy();
  });

  it('should call the onChange callback when typing', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TextareaCharCount {...defaultProps} onChange={onChange} />
    );
    const textareaElement = getByLabelText('Test label');
    fireEvent.change(textareaElement, { target: { value: 'test value' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
