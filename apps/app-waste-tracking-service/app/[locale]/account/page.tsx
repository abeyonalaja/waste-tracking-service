import * as GovUK from 'govuk-react-ui';
import { GridRow, LinkCard } from '../../components';
import { getTranslations } from 'next-intl/server';
import UserHeading from './_components/UserHeading';
import { Suspense } from 'react';
import { redirect } from '../../../navigation';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function Index() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect('/auth/signin');
  }
  const t = await getTranslations({ namespace: 'accountPage' });

  return (
    <Suspense>
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <UserHeading />
          <GovUK.Heading size={'m'} level={2}>
            {t('title')}
          </GovUK.Heading>
          <GovUK.SectionBreak size={'l'} />
          <GridRow display="flex-from-tablet">
            {process.env.NEXT_PUBLIC_UKWM_ENABLED === 'true' && (
              <GovUK.GridCol size="one-third">
                <LinkCard
                  id="link-card-UKWM"
                  title={t('cards.UKWM.title')}
                  content={t('cards.UKWM.description')}
                  href="/move-waste"
                />
              </GovUK.GridCol>
            )}

            <GovUK.GridCol size="one-third">
              <LinkCard
                id="link-card-GLW"
                title={t('cards.GLW.title')}
                content={t('cards.GLW.description')}
                href="/export-annex-VII-waste"
              />
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Suspense>
  );
}
