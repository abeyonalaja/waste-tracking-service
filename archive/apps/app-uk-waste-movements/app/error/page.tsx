import { useTranslations } from 'next-intl';
import { Page } from '@wts/ui/shared-ui/server';
import * as GovUK from '@wts/ui/govuk-react-ui';

export default function GenericErrorPage(): React.ReactNode {
  const t = useTranslations('error.multiplesError');

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol>
          <GovUK.Heading>{t('title')}</GovUK.Heading>
          <GovUK.Paragraph>{t('paragraphOne')}</GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
