import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorRow } from './ErrorRow';

const strings = {
  errorCount: 'errors',
  rowNumber: 'Row number',
  reason: 'Error reason',
  details: 'Error details',
  show: 'Show errors',
  hide: 'Hide errors',
};

const mockColumnError = {
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
};

const mockRowError = {
  rowNumber: 4,
  errorAmount: 16,
  errorDetails: [
    'The unique reference must be 20 characters or less',
    'Enter the producer organisation name',
    'Enter the producer address',
    'Enter the producer town or city',
    'The producer country must only be England, Wales, Scotland, or Northern Ireland',
    'Enter full name of producer contact',
    'Enter producer contact email address',
    'Enter the receiver organisation name',
    'Enter the receiver address',
    'Enter the receiver town or city',
    'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
    'Enter full name of receiver contact',
    'Enter receiver contact email address',
    'Number and type of transportation details must be less than 100 characters',
    'The waste collection address line 2 must be fewer than 250 characters',
    'Enter the waste collection town or city',
    'The mode of transport must only be Road, Rail, Air, Sea or Inland Waterway',
  ],
};

describe('ErrorRow component', () => {
  it('renders without error', () => {
    render(<ErrorRow error={mockColumnError} strings={strings} />);
  });

  it('Displays the name of the column with errors when the error is of column type', () => {
    render(<ErrorRow error={mockColumnError} strings={strings} />);

    const columnName = screen.getByText('Producer address line 1');

    expect(columnName).toBeInTheDocument();
  });

  it('Displays the row number with errors when error is of row type', () => {
    render(<ErrorRow error={mockRowError} strings={strings} />);

    const rowNumber = screen.getByText('4');

    expect(rowNumber).toBeInTheDocument();
  });

  it('Displays the number of errors in the column', () => {
    render(<ErrorRow error={mockColumnError} strings={strings} />);

    const errorCount = screen.getByText('2 errors');

    expect(errorCount).toBeInTheDocument();
  });

  it('Displays the error details when the show button is clicked on an error of column type', () => {
    render(<ErrorRow error={mockColumnError} strings={strings} />);

    const showButton = screen.getByRole('button', { name: 'Show errors' });

    act(() => {
      showButton.click();
    });

    const errorDetails = screen.getByText('Row number');

    expect(errorDetails).toBeInTheDocument();
  });

  it('Hides the error details when the hide button is clicked on error of column type', () => {
    render(<ErrorRow error={mockColumnError} strings={strings} />);

    const showButton = screen.getByRole('button', { name: 'Show errors' });

    act(() => {
      showButton.click();
    });

    const errorDetails = screen.queryByText('Row number');

    expect(errorDetails).toBeInTheDocument();

    const hideButton = screen.getByRole('button', { name: 'Hide errors' });

    act(() => {
      hideButton.click();
    });

    expect(errorDetails).not.toBeInTheDocument();
  });

  it('Shows the error details when the show button is clicked on an error of row type', () => {
    render(<ErrorRow error={mockRowError} strings={strings} />);

    const showButton = screen.getByRole('button', { name: 'Show errors' });

    act(() => {
      showButton.click();
    });

    const errorDetails = screen.getByText(
      'The unique reference must be 20 characters or less'
    );

    expect(errorDetails).toBeInTheDocument();
  });

  it('Hides the error details when the hide button is clicked on error of row type', () => {
    render(<ErrorRow error={mockRowError} strings={strings} />);

    const showButton = screen.getByRole('button', { name: 'Show errors' });

    act(() => {
      showButton.click();
    });

    const errorDetails = screen.queryByText(
      'The unique reference must be 20 characters or less'
    );

    expect(errorDetails).toBeInTheDocument();

    const hideButton = screen.getByRole('button', { name: 'Hide errors' });

    act(() => {
      hideButton.click();
    });

    expect(errorDetails).not.toBeInTheDocument();
  });
});
