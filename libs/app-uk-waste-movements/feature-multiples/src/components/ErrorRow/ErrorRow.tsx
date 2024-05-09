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
  rowIndex: number;
}

export function ErrorRow({ error, strings, rowIndex }: ErrorRowProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  function toggleExpanded() {
    setDetailsExpanded(!detailsExpanded);
  }

  if ('columnName' in error) {
    const { columnName, errorAmount, errorDetails } = error;
    const formattedColumnName = formatColumnName(columnName);
    return (
      <>
        <tr
          className="govuk-table__row"
          id={`column-row-${rowIndex}`}
          key={formattedColumnName}
        >
          <td
            className="govuk-table__cell govuk-body govuk-!-font-weight-bold"
            id={`column-row-${rowIndex}-column-name`}
          >
            {errorAmount} {strings.errorCount}
          </td>
          <td
            className="govuk-table__cell"
            id={`column-row-${rowIndex}-error-type`}
          >
            {columnName}
          </td>
          <td
            className="govuk-table__cell"
            id={`column-row-${rowIndex}-action`}
          >
            <button
              className={`govuk-accordion__show-all ${styles.showBtn}`}
              id={`column-row-${rowIndex}-action-button`}
              onClick={toggleExpanded}
              aria-controls={`column-row-${rowIndex}-details`}
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
            id={`column-row-${rowIndex}-details`}
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
                  {errorDetails.map((errorDetail, index) => (
                    <tr
                      className="govuk-table__row"
                      id={`column-row-${rowIndex}-details-${index}`}
                      key={errorDetail.rowNumber}
                    >
                      <td
                        className="govuk-table__cell govuk-!-font-weight-bold"
                        id={`column-row-${rowIndex}-details-${index}-row-number`}
                      >
                        {errorDetail.rowNumber}
                      </td>
                      <td
                        className="govuk-table__cell"
                        id={`column-row-${rowIndex}-details-${index}-error-reason`}
                      >
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
      <tr
        className="govuk-table__row"
        id={`row-row-${rowIndex}`}
        key={rowNumber}
      >
        <td
          className="govuk-table__cell govuk-body govuk-!-font-weight-bold"
          id={`row-row-${rowIndex}-row-number`}
        >
          {rowNumber}
        </td>
        <td
          className="govuk-table__cell"
          id={`row-row-${rowIndex}-error-amount`}
        >
          {errorAmount} {strings.errorCount}
        </td>
        <td className="govuk-table__cell" id={`row-row-${rowIndex}-action`}>
          <button
            className={`govuk-accordion__show-all ${styles.showBtn}`}
            id={`row-row-${rowIndex}-action-button`}
            onClick={toggleExpanded}
            aria-controls={`row-row-${rowIndex}-details`}
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
        <tr id={`row-row-${rowIndex}-details`} className={`govuk-table__row`}>
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
                {errorDetails.map((errorDetail, index) => (
                  <tr
                    className="govuk-table__row"
                    key={errorDetail}
                    id={`row-row-${rowIndex}-details-${index}`}
                  >
                    <td
                      className="govuk-table__cell"
                      id={`row-row-${rowIndex}-details-${index}-error-details`}
                    >
                      {errorDetail}
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
