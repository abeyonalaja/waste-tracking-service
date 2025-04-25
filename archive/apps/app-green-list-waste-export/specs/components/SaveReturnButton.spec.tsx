import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import '@testing-library/jest-dom';
import { SaveReturnButton } from 'components';
import 'i18n/config';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('Save Return Button', () => {
  const mockCallBack = jest.fn();
  const testId = 'save-return-button';

  it('renders with default text', async () => {
    await act(async () => {
      render(<SaveReturnButton onClick={mockCallBack} testId={testId} />);
    });

    const button = screen.getByTestId(testId);

    expect(button).toHaveTextContent('Save and return');
  });

  it('calls the provided callback function on click', async () => {
    await act(async () => {
      render(<SaveReturnButton onClick={mockCallBack} testId={testId} />);
    });

    const button = screen.getByTestId(testId);
    fireEvent.click(button);
    expect(mockCallBack).toHaveBeenCalled();
  });
});
