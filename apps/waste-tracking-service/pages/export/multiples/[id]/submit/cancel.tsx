import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import * as GovUK from 'govuk-react';
import { PageLayout } from 'features/multiples';
import { Paragraph, SaveReturnButton, ButtonGroup } from 'components';

export default function Cancel() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
      <GovUK.Heading size={'L'}>{t('multiples.cancel.title')}</GovUK.Heading>
      <Paragraph>{t('multiples.cancel.intro')}</Paragraph>
      <ButtonGroup>
        <GovUK.Button
          onClick={() => {
            queryClient.removeQueries({
              queryKey: ['multiples'],
            });
            router.push(`/export/multiples/`);
          }}
        >
          {t('multiples.cancel.confirmButton')}
        </GovUK.Button>
        <SaveReturnButton
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          {t('multiples.cancel.submitButton')}
        </SaveReturnButton>
      </ButtonGroup>
    </PageLayout>
  );
}

Cancel.auth = true;
