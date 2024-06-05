import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import { TextareaCharCount } from 'components';
import 'i18n/config';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('Character count textarea component', () => {
  const defaultProps = {
    id: 'test-id',
    name: 'test-name',
    charCount: 100,
    children: 'Test label',
  };

  it('should render without errors', async () => {
    await act(async () => {
      render(<TextareaCharCount {...defaultProps} />);
    });
  });

  it('should display the label', async () => {
    await act(async () => {
      render(<TextareaCharCount {...defaultProps} />);
    });

    const labelElement = screen.getByLabelText('Test label');

    expect(labelElement).toBeTruthy();
  });

  it('should display the hint text', async () => {
    await act(async () => {
      render(<TextareaCharCount {...defaultProps} hint="Test Hint" />);
    });

    const hintElement = screen.getByText('Test Hint');

    expect(hintElement).toBeTruthy();
  });

  it('should display the character count message', async () => {
    await act(async () => {
      render(<TextareaCharCount {...defaultProps} />);
    });

    const messageElement = screen.getByText(
      'You have 100 characters remaining',
    );

    expect(messageElement).toBeTruthy();
  });

  it('should update the character count when typing', async () => {
    await act(async () => {
      render(<TextareaCharCount {...defaultProps} />);
    });

    const textareaElement = screen.getByLabelText('Test label');
    fireEvent.change(textareaElement, { target: { value: 'test value' } });
    const messageElement = screen.getByText('You have 90 characters remaining');

    expect(messageElement).toBeTruthy();
  });

  it('should display an error message when the character count exceeds the limit', async () => {
    await act(async () => {
      render(<TextareaCharCount {...defaultProps} />);
    });

    const textareaElement = screen.getByLabelText('Test label');
    fireEvent.change(textareaElement, { target: { value: 'a'.repeat(101) } });
    const messageElement = screen.getByText('You have 1 character too many');

    expect(messageElement).toBeTruthy();
  });

  it('should call the onChange callback when typing', async () => {
    const onChange = jest.fn();

    await act(async () => {
      render(<TextareaCharCount {...defaultProps} onChange={onChange} />);
    });

    const textareaElement = screen.getByLabelText('Test label');
    fireEvent.change(textareaElement, { target: { value: 'test value' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
