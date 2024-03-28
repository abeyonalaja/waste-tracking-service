import { Link } from './components/';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('404');

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
