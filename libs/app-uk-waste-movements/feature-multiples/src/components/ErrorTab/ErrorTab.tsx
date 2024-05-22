'use client';

import {
  UkwmBulkSubmissionValidationRowError,
  UkwmBulkSubmissionValidationColumnError,
} from '@wts/api/waste-tracking-gateway';
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

interface ErrorTabProps {
  type: 'column' | 'row';
  errors:
    | UkwmBulkSubmissionValidationRowError[]
    | UkwmBulkSubmissionValidationColumnError[];
  strings: ErrorTabStrings;
}

export function ErrorTab({
  type,
  errors,
  strings,
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
            {type === 'column' ? strings.errorType : strings.errorAmount}
          </th>
          <th scope="col" className="govuk-table__header">
            {strings.action}
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {errors.map((error, index) => {
          if ('columnName' in error) {
            return (
              <ErrorRow
                error={error}
                key={error.columnName}
                strings={strings.rowStrings}
                rowIndex={index}
              />
            );
          }
          return (
            <ErrorRow
              error={error}
              key={error.rowNumber}
              strings={strings.rowStrings}
              rowIndex={index}
            />
          );
        })}
      </tbody>
    </table>
  );
}
