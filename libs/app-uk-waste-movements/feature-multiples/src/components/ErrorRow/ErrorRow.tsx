'use client';

import {
  UkwmBulkSubmissionValidationRowError,
  UkwmBulkSubmissionValidationColumnError,
} from '@wts/api/waste-tracking-gateway';
import { useState } from 'react';
import { formatColumnName } from '../../utils';
import styles from './ErrorRow.module.scss';

export type ErrorRowStrings = {
  errorCount: string;
  rowNumber: string;
  reason: string;
  details: string;
  show: string;
  hide: string;
};

interface ErrorRowProps {
  error:
    | UkwmBulkSubmissionValidationRowError
    | UkwmBulkSubmissionValidationColumnError;
  strings: ErrorRowStrings;
}

export function ErrorRow({ error, strings }: ErrorRowProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  function toggleExpanded() {
    setDetailsExpanded(!detailsExpanded);
  }

  if ('columnName' in error) {
    const { columnName, errorAmount, errorDetails } = error;
    const formattedColumnName = formatColumnName(columnName);
    return (
      <>
        <tr className="govuk-table__row" key={formattedColumnName}>
          <td className="govuk-table__cell govuk-body govuk-!-font-weight-bold">
            {errorAmount} {strings.errorCount}
          </td>
          <td className="govuk-table__cell">{columnName}</td>
          <td className="govuk-table__cell">
            <button
              className={`govuk-accordion__show-all ${styles.showBtn}`}
              onClick={toggleExpanded}
              aria-controls={`error-row-${formatColumnName(columnName)}`}
              aria-expanded={detailsExpanded}
            >
              <span
                className={`govuk-accordion-nav__chevron ${
                  !detailsExpanded && 'govuk-accordion-nav__chevron--down'
                } `}
              ></span>
              <span className="govuk-accordion__show-all-text">
                {detailsExpanded ? strings.hide : strings.show}
              </span>
            </button>
          </td>
        </tr>
        {detailsExpanded && (
          <tr
            id={`error-row-${formatColumnName(columnName)}`}
            className={`govuk-table__row`}
          >
            <td colSpan={3} className={styles.spacer}>
              <table className={`govuk-table ${styles.byColumn}`}>
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">
                      {strings.rowNumber}
                    </th>
                    <th scope="col" className="govuk-table__header">
                      {strings.reason}
                    </th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  {errorDetails.map((errorDetail) => (
                    <tr
                      className="govuk-table__row"
                      key={errorDetail.rowNumber}
                    >
                      <td className="govuk-table__cell govuk-!-font-weight-bold">
                        {errorDetail.rowNumber}
                      </td>
                      <td className="govuk-table__cell">
                        {errorDetail.errorReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </>
    );
  }

  const { rowNumber, errorAmount, errorDetails } = error;

  return (
    <>
      <tr className="govuk-table__row" key={rowNumber}>
        <td className="govuk-table__cell govuk-body govuk-!-font-weight-bold">
          {rowNumber}
        </td>
        <td className="govuk-table__cell">
          {errorAmount} {strings.errorCount}
        </td>
        <td className="govuk-table__cell">
          <button
            className={`govuk-accordion__show-all ${styles.showBtn}`}
            onClick={toggleExpanded}
            aria-controls={`error-row-${rowNumber}`}
            aria-expanded={detailsExpanded}
          >
            <span
              className={`govuk-accordion-nav__chevron ${
                !detailsExpanded && 'govuk-accordion-nav__chevron--down'
              } `}
            ></span>
            <span className="govuk-accordion__show-all-text">
              {detailsExpanded ? strings.hide : strings.show}
            </span>
          </button>
        </td>
      </tr>
      {detailsExpanded && (
        <tr id={`error-row-${rowNumber}`} className={`govuk-table__row`}>
          <td colSpan={3} className={styles.spacer}>
            <table className={`govuk-table`}>
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th scope="col" className="govuk-table__header">
                    {strings.details}
                  </th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                {errorDetails.map((errorDetail) => (
                  <tr className="govuk-table__row" key={errorDetail}>
                    <td className="govuk-table__cell">{errorDetail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}
