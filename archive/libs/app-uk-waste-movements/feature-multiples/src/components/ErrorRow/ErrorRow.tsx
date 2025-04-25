'use client';

import { useState } from 'react';
import { formatColumnName } from '../../utils';
import styles from './ErrorRow.module.scss';

export interface ErrorRowStrings {
  errorCount: string;
  rowNumber: string;
  reason: string;
  details: string;
  show: string;
  hide: string;
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

interface ErrorRowProps {
  error: ColumnBasedErrorSummary | RowBasedErrorSummary;
  strings: ErrorRowStrings;
  rowIndex: number;
  token: string | null | undefined;
  id: string;
}

interface ErrorDetails {
  rowNumber: number;
  messages: Array<string>;
}

export function ErrorRow({
  error,
  strings,
  rowIndex,
  token,
  id,
}: ErrorRowProps): JSX.Element {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [colErrors, setColErrors] = useState<{ errors: ErrorDetails[] } | null>(
    null,
  );
  const [rowErrors, setRowErrors] = useState<{ messages: string[] } | null>(
    null,
  );

  async function toggleExpanded(
    error: RowBasedErrorSummary | ColumnBasedErrorSummary,
  ) {
    if (rowErrors !== null || colErrors !== null) {
      setDetailsExpanded(!detailsExpanded);
    } else {
      await getErrorDetails(error);
    }
  }

  async function getErrorDetails(
    error: RowBasedErrorSummary | ColumnBasedErrorSummary,
  ) {
    let url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches/${id}`;

    if ('columnRef' in error) {
      url = `${url}/columns/${error.columnRef}`;
    } else {
      url = `${url}/rows/${error.rowId}`;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      await fetch(url, {
        method: 'GET',
        headers,
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            if ('columnRef' in error) {
              setColErrors(data);
            } else {
              setRowErrors(data);
            }
            setDetailsExpanded(true);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }

  if ('columnRef' in error) {
    const { columnRef, count } = error;
    const formattedColumnName = formatColumnName(columnRef);
    return (
      <>
        <tr
          className="govuk-table__row"
          id={`column-row-${rowIndex}`}
          key={formattedColumnName}
        >
          <td
            className="govuk-table__cell"
            id={`column-row-${rowIndex}-column-name`}
          >
            {columnRef}
          </td>
          <td
            className="govuk-table__cell"
            id={`column-row-${rowIndex}-error-type`}
          >
            {count} {strings.errorCount}
          </td>
          <td
            className="govuk-table__cell"
            id={`column-row-${rowIndex}-action`}
          >
            <button
              className={`govuk-accordion__show-all ${styles.showBtn}`}
              id={`column-row-${rowIndex}-action-button`}
              onClick={() => toggleExpanded(error)}
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
        {detailsExpanded && colErrors && (
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
                  {colErrors.errors.map((errorDetail, index) => (
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
                        {errorDetail.messages[0]}
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

  const { rowNumber, count } = error;

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
          {count} {strings.errorCount}
        </td>
        <td className="govuk-table__cell" id={`row-row-${rowIndex}-action`}>
          <button
            className={`govuk-accordion__show-all ${styles.showBtn}`}
            id={`row-row-${rowIndex}-action-button`}
            onClick={() => toggleExpanded(error)}
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
      {detailsExpanded && rowErrors && (
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
                {rowErrors.messages.map(
                  (errorDetail: string, index: number) => (
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
                  ),
                )}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}
