import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link, redirect } from '@wts/ui/navigation';
import { Page } from '@wts/ui/shared-ui/server';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Waste tracking service',
};

export default async function HomePage(): Promise<JSX.Element> {
  const session = await getServerSession();

  if (session && session.user) {
    redirect('/account');
  }

  const t = await getTranslations({ namespace: 'startPage' });

  return (
    <Page>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <GovUK.Heading size={'l'} level={1}>
            {t('title')}
          </GovUK.Heading>
          <p>
            <GovUK.Caption size={'l'}>{t('summary')}</GovUK.Caption>
          </p>
          <GovUK.Paragraph> {t('serviceFeatures.description')}</GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              {t('serviceFeatures.listElementOne')}
            </GovUK.ListItem>
            {process.env.NEXT_PUBLIC_UKWM_ENABLED !== 'false' && (
              <GovUK.ListItem>
                {t('serviceFeatures.listElementTwo')}
                <Link href="#" target="_blank">
                  {t('serviceFeatures.listElementTwoLink')}
                </Link>
              </GovUK.ListItem>
            )}
            <GovUK.ListItem>
              {t('serviceFeatures.listElementThree')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('serviceFeatures.listElementFour')}
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Paragraph> {t('paragraph')}</GovUK.Paragraph>
          <Link
            href="/account"
            className="govuk-button govuk-button--start"
            role="button"
          >
            {t('buttonStartNow')}
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </Link>
          <GovUK.Heading size={'m'} level={2}>
            {t('beforeYouStart.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.List type={'ordered'}>
            <GovUK.ListItem>
              {t('beforeYouStart.listElementOne')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('beforeYouStart.listElementTwo')}
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.List type={'unordered'}>
            <GovUK.ListItem>
              {t('beforeYouStart.unorderedListElementOne')}
            </GovUK.ListItem>
            <GovUK.ListItem>
              {t('beforeYouStart.unorderedListElementTwo')}
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.InsetText>{t('beforeYouStart.insetText')}</GovUK.InsetText>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionThree')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('beforeYouStart.descriptionFour')}
          </GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            {t('exportImportControls.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('exportImportControls.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('exportImportControls.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              <Link
                href="https://www.gov.uk/guidance/importing-and-exporting-waste"
                target="_blank"
              >
                {t('exportImportControls.linkOne')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link
                href="https://www.sepa.org.uk/regulations/waste/transfrontier-shipment-of-waste/"
                target="_blank"
              >
                {t('exportImportControls.linkTwo')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link
                href="https://naturalresources.wales/permits-and-permissions/waste-permitting/guidance-on-importing-and-exporting-waste/?lang=en"
                target="_blank"
              >
                {t('exportImportControls.linkThree')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link
                href="https://www.daera-ni.gov.uk/articles/transfrontier-shipment-waste"
                target="_blank"
              >
                {t('exportImportControls.linkFour')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
          </GovUK.List>
          <GovUK.Heading size={'m'} level={3}>
            {t('getHelpTechnicalIssue.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('getHelpTechnicalIssue.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('getHelpTechnicalIssue.emailKey')}{' '}
            <GovUK.Link
              href={`mailto:${t('getHelpTechnicalIssue.emailValue')}`}
            >
              {t('getHelpTechnicalIssue.emailValue')}
            </GovUK.Link>
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('getHelpTechnicalIssue.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.Heading size={'m'} level={3}>
            {t('getHelpRegulatoryIssue.title')}
          </GovUK.Heading>
          <GovUK.Paragraph>
            {t('getHelpRegulatoryIssue.descriptionOne')}
          </GovUK.Paragraph>
          <GovUK.Paragraph>
            {t('getHelpRegulatoryIssue.descriptionTwo')}
          </GovUK.Paragraph>
          <GovUK.List type="unordered">
            <GovUK.ListItem>
              <GovUK.Link
                href="https://www.gov.uk/browse/business/waste-environment"
                target="_blank"
              >
                {t('getHelpRegulatoryIssue.linkOne')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link
                href="https://www.sepa.org.uk/regulations/waste/"
                target="_blank"
              >
                {t('getHelpRegulatoryIssue.linkTwo')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link
                href="https://www.daera-ni.gov.uk/articles/waste-policy-tracker"
                target="_blank"
              >
                {t('getHelpRegulatoryIssue.linkThree')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
            <GovUK.ListItem>
              <GovUK.Link
                href="https://businesswales.gov.wales/topics-and-guidance/sustainability-and-social-responsibility/resource-efficiency/waste/managing-waste"
                target="_blank"
              >
                {t('getHelpRegulatoryIssue.linkFour')}{' '}
                <span className="govuk-visually-hidden">
                  (opens in new tab)
                </span>
              </GovUK.Link>
            </GovUK.ListItem>
          </GovUK.List>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
