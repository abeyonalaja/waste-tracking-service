import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslation } from '../../utils/useTranslation';
import { GridRow, LinkCard } from '../components';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
export const metadata = {
  title: 'Waste tracking service',
};
export default async function Index() {
  const session = await getServerSession();
  const { t } = useTranslation('accountPage');
  return (
    <>
      {!session && redirect('/auth/signin')}
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <GovUK.Heading size={'xl'} level={1}>
            {session?.user?.name}
          </GovUK.Heading>
          <GovUK.Heading size={'l'} level={2}>
            {t('titleTwo')}
          </GovUK.Heading>
          <GovUK.SectionBreak size={'l'} />
          <GridRow display="flex-from-tablet">
            <GovUK.GridCol size="one-third">
              <LinkCard
                title={t('cardOneTitle')}
                content={t('cardOneContent')}
                href="/move-waste"
              />
            </GovUK.GridCol>
            <GovUK.GridCol size="one-third">
              <LinkCard
                title={t('cardTwoTitle')}
                content={t('cardTwoContent')}
                href="/export-annex-VII-waste"
              />
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}

Index.auth = true;
