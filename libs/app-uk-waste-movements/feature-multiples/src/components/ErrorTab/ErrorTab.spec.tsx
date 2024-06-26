import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorTab } from './ErrorTab';

const strings = {
  byColumn: 'Errors by column',
  byRow: 'Errors by row',
  columnType: 'Column name',
  rowType: 'Row number',
  errorType: 'Error type',
  errorAmount: 'Error amount',
  action: 'Action',
  rowStrings: {
    errorCount: 'errors',
    rowNumber: 'Row number',
    reason: 'Error reason',
    details: 'Error details',
    show: 'Show errors',
    hide: 'Hide errors',
  },
};

const mockRowErrors = [
  {
    rowNumber: 1,
    rowId: 'row1',
    count: 2,
  },
  {
    rowNumber: 2,
    rowId: 'row2',
    count: 1,
  },
];

const mockColumnErrors = [
  {
    columnRef: 'Producer contact phone number',
    count: 2,
  },
  {
    columnRef: 'Waste Collection Details Country',
    count: 1,
  },
];

describe('ErrorTab component', () => {
  it('renders without error', () => {
    render(
      <ErrorTab
        type="column"
        errorSummary={mockColumnErrors}
        strings={strings}
        token={'token'}
        id={'test-batch-id'}
      />,
    );
  });

  it('Displays table headers when of column error type', () => {
    render(
      <ErrorTab
        type="column"
        errorSummary={mockColumnErrors}
        strings={strings}
        token={'token'}
        id={'test-batch-id'}
      />,
    );

    expect(screen.getByText('Column name')).toBeInTheDocument();
    expect(screen.getByText('Error amount')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('Displays table header rows when of row error type', () => {
    render(
      <ErrorTab
        type="row"
        errorSummary={mockRowErrors}
        strings={strings}
        token={'token'}
        id={'test-batch-id'}
      />,
    );

    expect(screen.getByText('Row number')).toBeInTheDocument();
    expect(screen.getByText('Error amount')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('Displays error count and type when of column error type', () => {
    render(
      <ErrorTab
        type="column"
        errorSummary={mockColumnErrors}
        strings={strings}
        token={'token'}
        id={'test-batch-id'}
      />,
    );

    expect(
      screen.getByText('Producer contact phone number'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Waste Collection Details Country'),
    ).toBeInTheDocument();
  });

  it('Displays row number and error type when of row error type', () => {
    render(
      <ErrorTab
        type="row"
        errorSummary={mockRowErrors}
        strings={strings}
        token={'token'}
        id={'test-batch-id'}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
