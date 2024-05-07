import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorTab } from './ErrorTab';

const strings = {
  byColumn: 'Errors by column',
  byRow: 'Errors by row',
  columnType: 'Column name',
  rowType: 'Row number',
  errorType: 'Error type',
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
    rowNumber: 3,
    errorAmount: 3,
    errorDetails: [
      'The unique reference must be 20 characters or less',
      'Enter the producer organisation name',
      'Enter the producer address',
    ],
  },
  {
    rowNumber: 4,
    errorAmount: 2,
    errorDetails: [
      'Enter receiver contact email address',
      'Number and type of transportation details must be less than 100 characters',
    ],
  },
];

const mockColumnErrors = [
  {
    columnName: 'Producer address line 1',
    errorAmount: 2,
    errorDetails: [
      {
        rowNumber: 3,
        errorReason: 'Enter the producer address',
      },
      {
        rowNumber: 4,
        errorReason: 'Enter the producer address',
      },
    ],
  },
  {
    columnName: 'Producer contact name',
    errorAmount: 2,
    errorDetails: [
      {
        rowNumber: 3,
        errorReason: 'Enter full name of producer contact',
      },
      {
        rowNumber: 4,
        errorReason: 'Enter full name of producer contact',
      },
    ],
  },
];

describe('ErrorTab component', () => {
  it('renders without error', () => {
    render(
      <ErrorTab type="column" errors={mockColumnErrors} strings={strings} />
    );
  });

  it('Displays table headers when of column error type', () => {
    render(
      <ErrorTab type="column" errors={mockColumnErrors} strings={strings} />
    );

    expect(screen.getByText('Column name')).toBeInTheDocument();
    expect(screen.getByText('Error type')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('Displays table header rows when of row error type', () => {
    render(<ErrorTab type="row" errors={mockRowErrors} strings={strings} />);

    expect(screen.getByText('Row number')).toBeInTheDocument();
    expect(screen.getByText('Error type')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('Displays error count and type when of column error type', () => {
    render(
      <ErrorTab type="column" errors={mockColumnErrors} strings={strings} />
    );

    expect(screen.getByText('Producer address line 1')).toBeInTheDocument();
    expect(screen.getByText('Producer contact name')).toBeInTheDocument();
  });

  it('Displays row number and error type when of row error type', () => {
    render(<ErrorTab type="row" errors={mockRowErrors} strings={strings} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
