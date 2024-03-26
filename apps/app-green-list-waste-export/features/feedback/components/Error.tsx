import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Heading } from 'govuk-react';
import { AppLink, Paragraph } from 'components';

interface ErrorProps {
  newWindow: boolean;
}

export default function Error({ newWindow }: ErrorProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Heading size="L">{t('feedback.error.heading')}</Heading>
      <Paragraph>
        {t('feedback.error.paragraph.1')}
        <br />
        <br />
        {t('feedback.error.paragraph.2')}
      </Paragraph>
      {newWindow ? (
        <AppLink colour={'green'} href="/" target="_self">
          {t('feedback.returnLink')}
        </AppLink>
      ) : (
        <AppLink
          href="#"
          target="_self"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          {t('feedback.backLink')}
        </AppLink>
      )}
    </>
  );
}
