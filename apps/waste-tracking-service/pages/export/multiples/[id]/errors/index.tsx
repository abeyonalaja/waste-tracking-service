import { useState } from 'react';
import { useRouter } from 'next/router';
import { PageLayout } from 'features/multiples';
import { UploadForm } from 'features/multiples';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ErrorSummary, Loader } from 'features/multiples';
import * as GovUK from 'govuk-react';
import { AppLink, Paragraph, NotificationBanner } from 'components';
import { getValidationResult } from 'features/multiples';
import { useQueryClient } from '@tanstack/react-query';
import { BulkSubmissionValidationRowError } from '@wts/api/waste-tracking-gateway';

export default function Index() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();
  const [showNotficationBanner, setShowNotificationBanner] = useState(true);

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

  const totalErrors = data.data.state.rowErrors.reduce(
    (total: number, current: BulkSubmissionValidationRowError) => {
      return total + current.errorAmount;
    },
    0
  );

  return (
    <PageLayout
      breadCrumbs={
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            queryClient.removeQueries({
              queryKey: ['multiples'],
            });
            router.push(`/export/multiples/`);
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      }
    >
      {showNotficationBanner && (
        <NotificationBanner
          type="important"
          id="error-banner-important"
          headingText={t('multiples.errorSummaryPage.importantMessage', {
            count: totalErrors,
          })}
        />
      )}
      <UploadForm setShowNotificationBanner={setShowNotificationBanner}>
        <GovUK.Heading size="L">
          {t('multiples.errorSummaryPage.heading')}
        </GovUK.Heading>
        <GovUK.Paragraph>
          {t('multiples.errorSummaryPage.leadParagraph')}
        </GovUK.Paragraph>
        <Paragraph>
          {t('multiples.errorSummaryPage.linkParagraphStart')}
          <AppLink href={'/export/multiples/guidance'} target="_blank">
            {t('multiples.errorSummaryPage.linkGuidanceText')}
          </AppLink>
          {t('multiples.errorSummaryPage.linkParagraphEnd')}
        </Paragraph>
        <ErrorSummary errors={data.data.state.rowErrors} />
      </UploadForm>
    </PageLayout>
  );
}

Index.auth = true;
