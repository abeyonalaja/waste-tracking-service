import { render, screen } from '@testing-library/react';
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

const mockRowError = {
  rowNumber: 2,
  rowId: 'row2',
  count: 1,
};
const mockColumnError = {
  columnRef: 'Producer contact phone number',
  count: 2,
};
describe('Error row component', () => {
  it('renders without error', () => {
    render(
      <table>
        <tbody>
          <ErrorRow
            error={mockColumnError}
            strings={strings}
            rowIndex={1}
            token={'token'}
            id={'id'}
          />
        </tbody>
      </table>,
    );
  });

  it('Displays the name of the column with errors when the error is of column type', () => {
    render(
      <table>
        <tbody>
          <ErrorRow
            error={mockColumnError}
            strings={strings}
            rowIndex={1}
            token={'token'}
            id={'id'}
          />
        </tbody>
      </table>,
    );

    const columnName = screen.getByText('Producer contact phone number');

    expect(columnName).toBeInTheDocument();
  });

  it('Displays the row number with errors when error is of row type', () => {
    render(
      <table>
        <tbody>
          <ErrorRow
            error={mockRowError}
            strings={strings}
            rowIndex={1}
            token={'token'}
            id={'id'}
          />
        </tbody>
      </table>,
    );

    const rowNumber = screen.getByText('2');

    expect(rowNumber).toBeInTheDocument();
  });

  it('Displays the number of errors in the column', () => {
    render(
      <table>
        <tbody>
          <ErrorRow
            error={mockColumnError}
            strings={strings}
            rowIndex={1}
            token={'token'}
            id={'id'}
          />
        </tbody>
      </table>,
    );

    const errorCount = screen.getByText('2 errors');

    expect(errorCount).toBeInTheDocument();
  });
});
