'use client';

import { Page } from '@wts/ui/shared-ui/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useEffect } from 'react';
interface ErrorProps {
  error: Error & { digest?: string };
}

export default function Error({ error }: ErrorProps) {
  const t = useTranslations('error.multiplesError');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading>{t('title')}</GovUK.Heading>
          <GovUK.Paragraph>{t('paragraphOne')}</GovUK.Paragraph>
          <GovUK.Paragraph>{t('paragraphTwo')}</GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('paragraphThreeOne')}{' '}
            <Link
              href="mailto: wasteuserresearch@defra.gov.uk"
              type="email "
              className="govuk-link"
            >
              wasteuserresearch@defra.gov.uk
            </Link>{' '}
            {t('paragraphThreeTwo')}
          </GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
