import { useTranslations } from 'next-intl';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { GridRow, LanguageSwitch, LinkCard } from '../../components/';

export const metadata = {
  title: 'UK waste movements',
};

export default function Index() {
  const t = useTranslations('accountPage');
  return (
    <>
      <GovUK.GridRow>
        <GovUK.GridCol size="full">
          <LanguageSwitch />
          <GovUK.Caption size={'l'}>
            {t('company', { company: 'Waste Producers Ltd' })}
          </GovUK.Caption>
          <GovUK.Heading size={'l'} level={1}>
            {t('name', { name: 'John Doe' })}
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
                href="#"
              />
            </GovUK.GridCol>
            <GovUK.GridCol size="one-third">
              <LinkCard
                title={t('cardTwoTitle')}
                content={t('cardTwoContent')}
                href="#"
              />
            </GovUK.GridCol>
            <GovUK.GridCol size="one-third">
              <LinkCard
                title={t('cardThreeTitle')}
                content={t('cardThreeContent')}
                href="#"
              />
            </GovUK.GridCol>
          </GridRow>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </>
  );
}
