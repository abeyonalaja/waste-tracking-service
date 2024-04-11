import Link from 'next/link';
import * as GovUK from 'govuk-react-ui';
import { useTranslations } from 'next-intl';
import { Page, GridRow } from '@wts/frontend/shared-ui/server';

export const metadata = {
  title: 'UK waste movements',
};

export default function Index() {
  const t = useTranslations('moveWastePage');

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size={'full'}>
          <GovUK.Heading size={'l'} level={1}>
            {t('title')}
          </GovUK.Heading>
          <GovUK.SectionBreak size="m" />
          <GridRow display="flex-from-tablet">
            <GovUK.GridCol size={'one-third'}>
              <GovUK.SummaryCard title={t('cardOneTitle')}>
                <Link href="/multiples">{t('cardOneContent')} </Link>
              </GovUK.SummaryCard>
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
