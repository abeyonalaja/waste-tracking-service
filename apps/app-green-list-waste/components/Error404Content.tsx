import React from 'react';
import * as GovUK from 'govuk-react';
import { AppLink } from './AppLink';
import { useTranslation } from 'react-i18next';

export const Error404Content = () => {
  const { t } = useTranslation();
  return (
    <>
      <GovUK.Heading size="LARGE">{t('404.title')}</GovUK.Heading>
      <GovUK.Paragraph>{t('404.paragraph1')}</GovUK.Paragraph>
      <GovUK.Paragraph>{t('404.paragraph2')}</GovUK.Paragraph>
      <p>
        <AppLink
          href={{
            pathname: '/export',
          }}
        >
          {t('404.link')}
        </AppLink>
      </p>
    </>
  );
};
