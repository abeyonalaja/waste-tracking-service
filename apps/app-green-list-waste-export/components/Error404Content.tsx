import React from 'react';
import * as GovUK from 'govuk-react';
import { AppLink, Paragraph } from 'components';
import { useTranslation } from 'react-i18next';

export const Error404Content = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <GovUK.Heading size="LARGE">{t('404.title')}</GovUK.Heading>
      <Paragraph>{t('404.paragraph1')}</Paragraph>
      <Paragraph>{t('404.paragraph2')}</Paragraph>
      <Paragraph>
        <AppLink
          href={{
            pathname: '/',
          }}
        >
          {t('404.link')}
        </AppLink>
      </Paragraph>
    </>
  );
};
