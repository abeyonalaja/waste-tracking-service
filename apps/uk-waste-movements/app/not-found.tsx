import Link from 'next/link';
import { useTranslation } from '../utils/useTranslation';
import * as GovUK from '@wts/ui/govuk-react-ui';
import React from 'react';

export default function NotFound() {
  const { t } = useTranslation('404');
  return (
    <>
      <GovUK.Heading size="l">{t('title')}</GovUK.Heading>
      <GovUK.Paragraph>{t('paragraph1')}</GovUK.Paragraph>
      <GovUK.Paragraph>{t('paragraph2')}</GovUK.Paragraph>
      <GovUK.Paragraph>
        <Link
          href={{
            pathname: '/account',
          }}
        >
          {t('link')}
        </Link>
      </GovUK.Paragraph>
    </>
  );
}
