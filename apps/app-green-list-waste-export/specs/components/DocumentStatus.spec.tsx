import React from 'react';
import { render } from 'jest-utils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { DocumentStatus } from 'components';
import 'i18n/config';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  }),
);

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

  test('renders "COMPLETED" tag when status is Complete', () => {
    const { getByText } = render(<DocumentStatus status="Complete" />);
    expect(getByText('Completed')).toBeInTheDocument();
  });

  test('renders "NOT STARTED" tag when status is invalid', () => {
    const { getByText } = render(<DocumentStatus status={-1} />);
    expect(getByText('Not started')).toBeInTheDocument();
  });
});
