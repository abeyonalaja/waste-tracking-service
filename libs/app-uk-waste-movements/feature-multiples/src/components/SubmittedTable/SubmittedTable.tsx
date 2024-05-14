'use client';

import * as GovUK from '@wts/ui/govuk-react-ui';
import { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';
import { sortSubmissions } from '../../utils';
import { useMemo } from 'react';
import { Link } from '@wts/ui/navigation';

import { Pagination } from '@wts/ui/shared-ui';
import { useState } from 'react';
// TODO: activate when working on filtering ticket
// import { useForm } from 'react-hook-form';
// import { filterSubmissions } from '../../utils';

import { useSearchParams } from 'next/navigation';
import styles from './SubmittedTable.module.scss';

type TableStrings = {
  headerOne: string;
  headerTwo: string;
  headerThree: string;
  headerFour: string;
  headerFive: string;
  action: string;
};

export type SubmittedPageFormData = {
  wasteMovementId: string;
  day: number;
  month: number;
  year: number;
  ewcCode: string;
  producerName: string;
};

interface SubmittedTableProps {
  submissions: UkwmSubmissionReference[];
  tableStrings: TableStrings;
}

export function SubmittedTable({
  submissions,
  tableStrings,
}: SubmittedTableProps): React.ReactElement {
  const sortedSubmissions = useMemo(
    () => sortSubmissions(submissions, 'ascending'),
    [submissions]
  );

  const searchParams = useSearchParams();

  // TODO: Remove this disbaling line when working on filtering ticket
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filteredSubmissions, setFilteredSubmissions] =
    useState(sortedSubmissions);

  // TODO: activate when working on filtering ticket
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<SubmittedPageFormData>({
  //   mode: 'onSubmit',
  // });
  // const onSubmit = handleSubmit((formData) => {
  //   setFilteredSubmissions(filterSubmissions(sortedSubmissions, formData));
  //   router.push(`/multiples/${submissionId}/view?page=1`, { scroll: false });
  // });

  const totalPages = Math.ceil(filteredSubmissions.length / 15);

  const displayedSubmissions = filteredSubmissions.slice(
    (Number(searchParams.get('page')) - 1) * 15,
    Number(searchParams.get('page')) * 15
  );

  return (
    <GovUK.GridRow>
      <GovUK.GridCol size="one-quarter-from-desktop">
        {/* TODO: Add filters here */}
        <br />
      </GovUK.GridCol>
      <GovUK.GridCol size="three-quarters-from-desktop">
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
                      href="#"
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
        <Pagination totalPages={totalPages} />
      </GovUK.GridCol>
    </GovUK.GridRow>
  );
}
