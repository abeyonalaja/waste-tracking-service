'use client';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslation } from '../../utils/useTranslation';
import { GridRow, LinkCard } from '../components';
import { useSession } from 'next-auth/react';

export default function Index() {
  const { t } = useTranslation('accountPage');
  const { data: session } = useSession();

  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <GovUK.Heading size={'l'} level={1}>
            {session?.user?.name}
          </GovUK.Heading>
          <GovUK.Heading size={'m'} level={2}>
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
