import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { DocumentStatus } from '../../components/';

describe('DocumentStatus', () => {
  test('renders "CANNOT START YET" tag when status is CannotStart', () => {
    const { getByTestId } = render(<DocumentStatus status="CannotStart" />);
    expect(getByTestId('CST')).toHaveTextContent('Cannot start yet');
  });

  test('renders "NOT STARTED" tag when status is NotStarted', () => {
    const { getByTestId } = render(<DocumentStatus status="NotStarted" />);
    expect(getByTestId('NS')).toHaveTextContent('Not started');
  });

  test('renders "IN PROGRESS" tag when status is InProgress', () => {
    const { getByText } = render(<DocumentStatus status="Started" />);
    expect(getByText('In progress')).toBeInTheDocument();
  });

  test('renders "COMPLETED" tag when status is Completed', () => {
    const { getByText } = render(<DocumentStatus status="Completed" />);
    expect(getByText('Completed')).toBeInTheDocument();
  });

  test('renders "NOT STARTED" tag when status is invalid', () => {
    const { getByText } = render(<DocumentStatus status={-1} />);
    expect(getByText('Not started')).toBeInTheDocument();
  });
});
