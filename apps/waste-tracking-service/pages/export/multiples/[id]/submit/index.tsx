import { useRouter } from 'next/router';
import { PageLayout, ValidationSuccess } from 'features/multiples';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { getValidationResult, Loader } from 'features/multiples';

export default function Submit() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Infers user has corrected errors if they have uploaded multiple files
  let hasCorrectedErrors = false;
  if (
    queryClient.getQueriesData({
      queryKey: ['multiples'],
    }).length > 1
  ) {
    hasCorrectedErrors = true;
  }

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
    if (error) {
      router.push('/404');
      return;
    }
  }

  const recordCount: number = data.data.state.submissions.length;

  return (
    <PageLayout
      breadCrumbs={
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.push(`/export/multiples/${router.query.id}/submit/cancel`);
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      }
    >
      <ValidationSuccess
        recordCount={recordCount}
        hasCorrectedErrors={hasCorrectedErrors}
      />
    </PageLayout>
  );
}

Submit.auth = true;
