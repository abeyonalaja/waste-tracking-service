import { Link } from '@wts/ui/navigation';
import styles from './SubmittedTable.module.scss';
import { BulkSubmissionPartialSummary } from '@wts/api/uk-waste-movements-bulk';
import { useTranslations } from 'next-intl';

interface SubmittedTableProps {
  submissions: BulkSubmissionPartialSummary[];
}

export function SubmittedTable({
  submissions,
}: SubmittedTableProps): React.ReactElement {
  const t = useTranslations('multiples.manage.table');

  return (
    <table className={`govuk-table ${styles.submittedTable}`}>
      <thead className="govsuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            {t('headerOne')}
          </th>
          <th scope="col" className="govuk-table__header">
            {t('headerTwo')}
          </th>
          <th scope="col" className="govuk-table__header">
            {t('headerThree')}
          </th>
          <th scope="col" className="govuk-table__header">
            {t('headerFour')}
          </th>
          <th scope="col" className="govuk-table__header">
            {t('headerFive')}
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {submissions.length === 0 && (
          <tr className="govuk-table__row">
            <td colSpan={5} className={styles.notFound}>
              {t('notFound')}
            </td>
          </tr>
        )}
        {submissions.map((submission) => {
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
                data-label={t('headerOne')}
              >
                {submission.wasteMovementId}
              </th>
              <td
                className="govuk-table__cell"
                id={`row-${submission.wasteMovementId}-collection-date`}
                data-label={t('headerTwo')}
              >
                {submission.collectionDate.day}/
                {submission.collectionDate.month}/
                {submission.collectionDate.year}
              </td>
              <td
                className="govuk-table__cell"
                id={`row-${submission.wasteMovementId}-ewc-code`}
                data-label={t('headerThree')}
              >
                {submission.ewcCode}
              </td>
              <td
                className="govuk-table__cell"
                id={`row-${submission.wasteMovementId}-producer-name`}
                data-label={t('headerFour')}
              >
                {submission.producerName}
              </td>
              <td
                className="govuk-table__cell"
                id={`row-${submission.wasteMovementId}-action`}
                data-label={t('headerFive')}
              >
                <Link
                  href={`view/${submission.id}`}
                  id={`row-${submission.wasteMovementId}-view-link`}
                >
                  {t('action')}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
