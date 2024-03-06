import Link from 'next/link';
import { GridRow } from '../components';
import * as GovUK from '@wts/ui/govuk-react-ui';

export const metadata = {
  title: 'UK waste movements',
};

export default function Index() {
  const breadcrumbItems = [
    { text: 'Home', href: '/move-waste' },
    { text: 'Move waste in the UK', href: '/move-waste/en/move-waste' },
  ];
  const t = function (text: string) {
    return text;
  };
  return (
    <>
      <GovUK.Breadcrumbs items={breadcrumbItems} />
      <GovUK.GridRow>
        <GovUK.GridCol size={'full'}>
          <GovUK.Heading size={'l'} level={1}>
            {t('title')}
          </GovUK.Heading>
          <GovUK.SectionBreak size="m" />
          <GridRow display="flex-from-tablet">
            <GovUK.GridCol size={'one-third'}>
              <GovUK.SummaryCard title={t('cardOneTitle')}>
                <Link href="#">{t('cardOneContent')} </Link>
              </GovUK.SummaryCard>
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
