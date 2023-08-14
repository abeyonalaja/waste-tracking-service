import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SaveReturnButton } from 'components';
import 'i18n/config';

describe('Save Return Button', () => {
  const mockCallBack = jest.fn();
  const testId = 'save-return-button';

  it('renders with default text', () => {
    const { getByTestId } = render(
      <SaveReturnButton onClick={mockCallBack} testId={testId} />
    );
    const button = getByTestId(testId);
    expect(button).toHaveTextContent('Save and return');
  });

  it('calls the provided callback function on click', () => {
    const { getByTestId } = render(
      <SaveReturnButton onClick={mockCallBack} testId={testId} />
    );
    const button = getByTestId(testId);
    fireEvent.click(button);
    expect(mockCallBack).toHaveBeenCalled();
  });
});
