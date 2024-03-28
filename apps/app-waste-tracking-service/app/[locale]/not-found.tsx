import { LanguageSwitcher, Link } from '../components/';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('404');

  return (
    <>
      <GovUK.Header />
      <GovUK.WidthContainer>
        <GovUK.PhaseBanner tag={`Private beta`}>
          {'This is a new service'}
        </GovUK.PhaseBanner>
      </GovUK.WidthContainer>
      <GovUK.WidthContainer>
        <LanguageSwitcher />
      </GovUK.WidthContainer>
      <GovUK.WidthContainer>
        <GovUK.Main>
          <GovUK.Heading size="l">{t('title')}</GovUK.Heading>
          <GovUK.Paragraph>{t('paragraph1')}</GovUK.Paragraph>
          <GovUK.Paragraph>{t('paragraph2')}</GovUK.Paragraph>
          <GovUK.Paragraph>
            <Link
              className={'govuk-link govuk-link--no-visited-state'}
              href={{
                pathname: '/account',
              }}
            >
              {t('link')}
            </Link>
          </GovUK.Paragraph>
        </GovUK.Main>
      </GovUK.WidthContainer>
      <GovUK.Footer />
    </>
  );
}
