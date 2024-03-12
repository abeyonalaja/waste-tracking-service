import Link from 'next/link';
import { GridRow } from './components';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslation } from '../utils/useTranslation';

export const metadata = {
  title: 'UK waste movements',
};

export default function Index() {
  const { t } = useTranslation('moveWastePage');
  return (
    <>
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
