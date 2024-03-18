import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  PageLayout,
  getValidationResult,
  SubmissionDeclaration,
  Loader,
} from 'features/multiples';

export default function Confirm() {
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
            router.push(`/multiples/${router.query.id}/submit/`);
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      }
    >
      <SubmissionDeclaration recordCount={recordCount} />
    </PageLayout>
  );
}

Confirm.auth = true;
