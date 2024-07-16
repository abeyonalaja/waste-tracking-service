import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import process from 'node:process';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { GuidanceButton } from '@wts/app-waste-tracking-service/feature-service-charge';

export const metadata: Metadata = {
  title: 'Pay the annual waste tracking service charge',
};

export default async function GuidancePage(): Promise<JSX.Element> {
  const serviceChargeEnabled = process.env.SERVICE_CHARGE_ENABLED === 'true';
  if (!serviceChargeEnabled) {
    // Redirect to account page if service charge is not enabled
    redirect('/account');
  }
  const t = await getTranslations('charge.guidance');
  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading>{t('title')}</GovUK.Heading>
          <GovUK.Paragraph>
            {t.rich('paragraphOne', {
              price: 20,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            <strong>{t('paragraphTwo')}</strong>
          </GovUK.Paragraph>
          <GovUK.List type={'unordered'}>
            <GovUK.ListItem>{t('listOneListItemOne')}</GovUK.ListItem>
            <GovUK.ListItem>{t('listOneListItemTwo')}</GovUK.ListItem>
            <GovUK.ListItem>{t('listOneListItemThree')}</GovUK.ListItem>
          </GovUK.List>
          <GovUK.Paragraph>{t('paragraphThree')}</GovUK.Paragraph>
          <GovUK.List type={'unordered'}>
            <GovUK.ListItem>{t('listTwoListItemOne')}</GovUK.ListItem>
            <GovUK.ListItem>{t('listTwoListItemTwo')}</GovUK.ListItem>
          </GovUK.List>
          <GovUK.WarningText>{t('warning')}</GovUK.WarningText>
          <GovUK.ButtonGroup>
            <GuidanceButton>{t('buttonPay')}</GuidanceButton>
            <GovUK.Button href={'/account'} secondary={true}>
              {t('buttonCancel')}
            </GovUK.Button>
          </GovUK.ButtonGroup>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
