'use client';

import { useState } from 'react';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';
import { sortSubmissions } from '../../utils';
import { useMemo } from 'react';
import { Link } from '@wts/ui/navigation';
import { Pagination } from '@wts/ui/shared-ui';
import { SubmittedFilters } from '../SubmittedFilters';
import styles from './SubmittedTable.module.scss';

interface TableStrings {
  headerOne: string;
  headerTwo: string;
  headerThree: string;
  headerFour: string;
  headerFive: string;
  action: string;
  notFound: string;
}

interface SubmittedTableProps {
  submissions: UkwmSubmissionReference[];
  tableStrings: TableStrings;
}

export function SubmittedTable({
  submissions,
  tableStrings,
}: SubmittedTableProps): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedSubmissions = useMemo(
    () => sortSubmissions(submissions, 'ascending'),
    [submissions],
  );

  const [filteredSubmissions, setFilteredSubmissions] =
    useState(sortedSubmissions);

  const totalPages = Math.ceil(filteredSubmissions.length / 15);

  const displayedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * 15,
    currentPage * 15,
  );

  return (
    <GovUK.GridRow>
      <GovUK.GridCol size="one-third-from-desktop">
        <SubmittedFilters
          sortedSubmissions={sortedSubmissions}
          setFilteredSubmissions={setFilteredSubmissions}
          setCurrentPage={setCurrentPage}
        />
      </GovUK.GridCol>
      <GovUK.GridCol size="two-thirds-from-desktop">
        <table className={`govuk-table ${styles.submittedTable}`}>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">
                {tableStrings.headerOne}
              </th>
              <th scope="col" className="govuk-table__header">
                {tableStrings.headerTwo}
              </th>
              <th scope="col" className="govuk-table__header">
                {tableStrings.headerThree}
              </th>
              <th scope="col" className="govuk-table__header">
                {tableStrings.headerFour}
              </th>
              <th scope="col" className="govuk-table__header">
                {tableStrings.headerFive}
              </th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {displayedSubmissions.length === 0 && (
              <tr className="govuk-table__row">
                <td colSpan={5} className={styles.notFound}>
                  {tableStrings.notFound}
                </td>
              </tr>
            )}
            {displayedSubmissions.map((submission) => {
              return (
                <tr
                  className="govuk-table__row"
                  id={`row-${submission.wasteMovementId}`}
                  key={submission.wasteMovementId}
                >
                  <th
                    scope="row"
                    className="govuk-table__cell govuk-table__header"
                    id={`row-${submission.wasteMovementId}-id`}
                    data-label={tableStrings.headerOne}
                  >
                    {submission.wasteMovementId}
                  </th>
                  <td
                    className="govuk-table__cell"
                    id={`row-${submission.wasteMovementId}-collection-date`}
                    data-label={tableStrings.headerTwo}
                  >
                    {submission.collectionDate.day}/
                    {submission.collectionDate.month}/
                    {submission.collectionDate.year}
                  </td>
                  <td
                    className="govuk-table__cell"
                    id={`row-${submission.wasteMovementId}-ewc-code`}
                    data-label={tableStrings.headerThree}
                  >
                    {submission.ewcCodes[0]}
                  </td>
                  <td
                    className="govuk-table__cell"
                    id={`row-${submission.wasteMovementId}-producer-name`}
                    data-label={tableStrings.headerFour}
                  >
                    {submission.producerName}
                  </td>
                  <td
                    className="govuk-table__cell"
                    id={`row-${submission.wasteMovementId}-action`}
                    data-label={tableStrings.headerFive}
                  >
                    <Link
                      href={`view/${submission.id}`}
                      id={`row-${submission.wasteMovementId}-view-link`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </GovUK.GridCol>
    </GovUK.GridRow>
  );
}
