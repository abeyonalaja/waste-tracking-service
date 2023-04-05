import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { SaveReturnLink } from '../../components/';

describe('SaveReturnLink', () => {
  const mockCallBack = jest.fn();
  const testId = 'save-return-link';

  it('renders with default text', () => {
    const { getByTestId } = render(<SaveReturnLink callBack={mockCallBack} testId={testId} />);
    const linkElement = getByTestId(testId).querySelector('a');
    expect(linkElement).toHaveTextContent('Save and return to draft');
  });

  it('calls the provided callback function on click', () => {
    const { getByTestId } = render(<SaveReturnLink callBack={mockCallBack} testId={testId} />);
    const linkElement = getByTestId(testId).querySelector('a');
    fireEvent.click(linkElement);
    expect(mockCallBack).toHaveBeenCalled();
  });

});
