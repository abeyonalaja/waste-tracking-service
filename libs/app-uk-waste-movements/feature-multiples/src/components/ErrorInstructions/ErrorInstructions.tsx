import { useTranslations } from 'next-intl';
import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';

export function ErrorInstructions(): JSX.Element {
  const t = useTranslations('multiples.errors.instructions');

  return (
    <>
      <GovUK.Paragraph>{t('paragraphOne')}</GovUK.Paragraph>
      <GovUK.Paragraph>
        <span>
          {t('paragraphTwoOne')}
          <Link href="/multiples/guidance" target="_blank">
            {t('linkText')}
          </Link>
          {t('paragraphTwoTwo')}
        </span>
      </GovUK.Paragraph>
    </>
  );
}
