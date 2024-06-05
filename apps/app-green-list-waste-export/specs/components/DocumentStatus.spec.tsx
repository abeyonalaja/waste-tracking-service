import React from 'react';
import { render, screen, act } from 'jest-utils';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { DocumentStatus } from 'components';
import 'i18n/config';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('DocumentStatus', () => {
  test('renders "CANNOT START YET" tag when status is CannotStart', async () => {
    await act(async () => {
      render(<DocumentStatus status="CannotStart" />);
    });

    expect(screen.getByTestId('CST')).toHaveTextContent('Cannot start yet');
  });

  test('renders "NOT STARTED" tag when status is NotStarted', async () => {
    await act(async () => {
      render(<DocumentStatus status="NotStarted" />);
    });

    expect(screen.getByTestId('NS')).toHaveTextContent('Not started');
  });

  test('renders "IN PROGRESS" tag when status is InProgress', async () => {
    await act(async () => {
      render(<DocumentStatus status="Started" />);
    });

    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  test('renders "COMPLETED" tag when status is Complete', async () => {
    await act(async () => {
      render(<DocumentStatus status="Complete" />);
    });

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('renders "NOT STARTED" tag when status is invalid', async () => {
    await act(async () => {
      render(<DocumentStatus status={-1} />);
    });

    expect(screen.getByText('Not started')).toBeInTheDocument();
  });
});
