'use client';

import { ErrorRow } from '../ErrorRow';
import type { ErrorRowStrings } from '../ErrorRow/ErrorRow';
import styles from './ErrorTab.module.scss';

interface ErrorTabStrings {
  columnType: string;
  rowType: string;
  errorType: string;
  errorAmount: string;
  action: string;
  rowStrings: ErrorRowStrings;
}

interface ColumnBasedErrorSummary {
  columnRef: string;
  count: number;
}

interface RowBasedErrorSummary {
  rowNumber: number;
  rowId: string;
  count: number;
}

interface ErrorTabProps {
  type: 'column' | 'row';
  errorSummary: RowBasedErrorSummary[] | ColumnBasedErrorSummary[];
  strings: ErrorTabStrings;
  token: string | null | undefined;
  id: string;
}

export function ErrorTab({
  type,
  errorSummary,
  strings,
  token,
  id,
}: ErrorTabProps): JSX.Element {
  return (
    <table
      className={`govuk-table ${
        type === 'column' ? styles.byColumn : styles.byRow
      }`}
    >
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            {type === 'column' ? strings.columnType : strings.rowType}
          </th>
          <th scope="col" className="govuk-table__header">
            {strings.errorAmount}
          </th>
          <th scope="col" className="govuk-table__header">
            {strings.action}
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {errorSummary.map((error, index) => {
          if (type === 'column') {
            return (
              <ErrorRow
                error={error}
                key={'columnRef' in error ? error.columnRef : ''}
                strings={strings.rowStrings}
                rowIndex={index}
                token={token}
                id={id}
              />
            );
          }
          return (
            <ErrorRow
              error={error}
              key={'rowNumber' in error ? error.rowNumber : ''}
              strings={strings.rowStrings}
              rowIndex={index}
              token={token}
              id={id}
            />
          );
        })}
      </tbody>
    </table>
  );
}
