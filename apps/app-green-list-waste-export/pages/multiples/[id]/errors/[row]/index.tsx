import { useRouter } from 'next/router';
import { PageLayout } from 'features/multiples';
import * as GovUK from 'govuk-react';
import { Paragraph, AppLink, SaveReturnButton } from 'components';
import { RED } from 'govuk-colours';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BulkSubmissionValidationRowError } from '@wts/api/waste-tracking-gateway';
import { getValidationResult } from 'features/multiples';
import { Loader } from 'features/multiples';

const ErrorBanner = styled('div')`
  padding: 20px 20px 0;
  border: 5px solid ${RED};
  margin-bottom: 30px;
`;

export default function RowErrors() {
  const router = useRouter();
  const { t } = useTranslation();

  const { isPending, data, error } = useQuery({
    queryKey: ['multiples', router.query.id],
    queryFn: async () => {
      return await getValidationResult(router.query.id as string);
    },
    enabled: !!router.query.id,
  });

  if (isPending) {
    return (
      <PageLayout setWidth="full">
        <Loader />
      </PageLayout>
    );
  }

  if (error) {
    router.push('/404');
    return;
  }

  const row: BulkSubmissionValidationRowError = data.data.state.rowErrors.find(
    (row: BulkSubmissionValidationRowError) =>
      row.rowNumber === Number(router.query.row),
  );

  return (
    <PageLayout
      breadCrumbs={
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      }
    >
      <ErrorBanner>
        <GovUK.H2 size="MEDIUM">
          {t('multiples.errorSummaryPage.errorList.title', {
            count: row.errorAmount,
          })}
        </GovUK.H2>
        <Paragraph>
          {t('multiples.errorSummaryPage.errorList.heading')}
          <AppLink href={'/multiples/guidance'} target="_blank">
            {t('multiples.errorSummaryPage.linkGuidanceText')}
          </AppLink>
        </Paragraph>
      </ErrorBanner>
      <GovUK.Heading size="L">
        {t('multiples.errorSummaryPage.errorList.rowCorrection', {
          rowNumber: router.query.row,
        })}
      </GovUK.Heading>
      <GovUK.Paragraph>
        {t('multiples.errorSummaryPage.errorList.rowCorrection.para')}
      </GovUK.Paragraph>
      <GovUK.Table
        caption={null}
        head={
          <GovUK.Table.Row>
            <GovUK.Table.CellHeader scope="col">
              {t('multiples.errorSummaryPage.errorListTable.heading')}
            </GovUK.Table.CellHeader>
          </GovUK.Table.Row>
        }
      >
        {row.errorDetails.map((error, index) => (
          <GovUK.Table.Row key={`error-row-${index}`}>
            <GovUK.Table.Cell id={`error-${index}`}>{error}</GovUK.Table.Cell>
          </GovUK.Table.Row>
        ))}
      </GovUK.Table>
      <SaveReturnButton
        href="#"
        id="back-to-summary-table-button"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >
        {t('multiples.errorSummaryPage.errorListTable.button')}
      </SaveReturnButton>
    </PageLayout>
  );
}

RowErrors.auth = true;
