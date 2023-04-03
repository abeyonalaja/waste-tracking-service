import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import DocumentStatus from '../../components/DocumentStatus';

describe('DocumentStatus', () => {
  test('renders "CANNOT START YET" tag when status is CannotStart', () => {
    const { getByTestId } = render(<DocumentStatus status="CannotStart" />);
    expect(getByTestId('CST')).toHaveTextContent('CANNOT START YET');
  });

  test('renders "NOT STARTED" tag when status is NotStarted', () => {
    const { getByTestId } = render(<DocumentStatus status="NotStarted" />);
    expect(getByTestId('NS')).toHaveTextContent('NOT STARTED');
  });

  test('renders "IN PROGRESS" tag when status is InProgress', () => {
    const { getByText } = render(<DocumentStatus status="InProgress" />);
    expect(getByText('IN PROGRESS')).toBeInTheDocument();
  });

  test('renders "COMPLETED" tag when status is Completed', () => {
    const { getByText } = render(<DocumentStatus status="Completed" />);
    expect(getByText('COMPLETED')).toBeInTheDocument();
  });

  test('renders "NOT STARTED" tag when status is invalid', () => {
    const { getByText } = render(<DocumentStatus status={-1} />);
    expect(getByText('NOT STARTED')).toBeInTheDocument();
  });
});
