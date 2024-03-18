import * as GovUK from '@wts/ui/govuk-react-ui';
import { GridRow, LinkCard } from '../../components';
import { useTranslations } from 'next-intl';
import UserHeading from './_components/UserHeading';
import { Suspense } from 'react';

export default function Index() {
  const t = useTranslations('accountPage');

  return (
    <GovUK.GridRow>
      <GovUK.GridCol size="full">
        <Suspense>
          <UserHeading />
        </Suspense>
        <GovUK.Heading size={'m'} level={2}>
          {t('title')}
        </GovUK.Heading>
        <GovUK.SectionBreak size={'l'} />
        <GridRow display="flex-from-tablet">
          <GovUK.GridCol size="one-third">
            <LinkCard
              title={t('cards.UKWM.title')}
              content={t('cards.UKWM.description')}
              href="../move-waste"
            />
          </GovUK.GridCol>
          <GovUK.GridCol size="one-third">
            <LinkCard
              title={t('cards.GLW.title')}
              content={t('cards.GLW.description')}
              href="../export-annex-VII-waste"
            />
          </GovUK.GridCol>
        </GridRow>
      </GovUK.GridCol>
    </GovUK.GridRow>
  );
}
