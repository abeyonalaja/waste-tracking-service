import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { BackLink } from '@wts/ui/shared-ui/server';
import { UniqueReferenceForm } from '@wts/app-uk-waste-movements/feature-single';
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: 'Creating a single waste movement',
  description: 'Creating a single waste movement',
};

export default async function ReferencePage(): Promise<React.ReactNode> {
  const t = await getTranslations('single.uniqueReference');
  const session = await getServerSession(options);

  const formStrings = {
    errorSummaryHeading: t('form.errorSummaryHeading'),
    inputLabel: t('form.inputLabel'),
    buttonLabel: t('form.buttonLabel'),
  };

  return (
    <Page beforeChildren={<BackLink href={'/'} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <UniqueReferenceForm
            token={session?.token as string}
            formStrings={formStrings}
          >
            <GovUK.Caption>{t('caption')}</GovUK.Caption>
            <GovUK.Heading size={'l'} level={1}>
              {t('title')}
            </GovUK.Heading>
            <GovUK.Paragraph>{t('description')}</GovUK.Paragraph>
            <GovUK.Paragraph>{t('allowed.text')}</GovUK.Paragraph>
            <GovUK.List type="unordered">
              <GovUK.ListItem>{t('allowed.itemOne')}</GovUK.ListItem>
              <GovUK.ListItem>{t('allowed.itemTwo')}</GovUK.ListItem>
              <GovUK.ListItem>{t('allowed.itemThree')}</GovUK.ListItem>
              <GovUK.ListItem>{t('allowed.itemFour')}</GovUK.ListItem>
              <GovUK.ListItem>{t('allowed.itemFive')}</GovUK.ListItem>
              <GovUK.ListItem>{t('allowed.itemSix')}</GovUK.ListItem>
            </GovUK.List>
            <GovUK.Paragraph>{t('example')}</GovUK.Paragraph>
          </UniqueReferenceForm>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
