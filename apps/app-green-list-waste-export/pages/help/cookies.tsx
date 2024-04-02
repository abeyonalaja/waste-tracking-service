import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  BreadcrumbWrap,
  ButtonGroup,
  Footer,
  Header,
  NotificationBanner,
  Paragraph,
} from 'components';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { Radio } from 'govuk-react';
import { useCookies } from 'react-cookie';
import { add } from 'date-fns';

const Cookies = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME;
  const [cookies, setCookie] = useCookies([cookieName]);

  useEffect(() => {
    if (cookies[cookieName]) {
      setAnalyticsConsent(cookies[cookieName].analytics);
    } else {
      setAnalyticsConsent(false);
    }
  }, [cookies, cookieName]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const cookieValue: string = JSON.stringify({
      analytics: analyticsConsent,
    });

    setCookie(cookieName, cookieValue, {
      path: '/',
      sameSite: true,
      expires: add(new Date(), {
        years: 1,
      }),
    });

    window.location.replace('/help/cookies?updated=true');
  };

  const BreadCrumbs = () => {
    const { t } = useTranslation();
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            history.back();
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('cookie.page.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {router.query.updated && (
              <NotificationBanner
                type="success"
                headingText={t('cookie.page.saved')}
              >
                <AppLink
                  href="#"
                  colour={'green'}
                  isBold
                  onClick={(e) => {
                    e.preventDefault();
                    history.back();
                  }}
                >
                  {t('cookie.page.saved.link')}
                </AppLink>
              </NotificationBanner>
            )}
            <GovUK.Heading size="L">{t('cookie.page.title')}</GovUK.Heading>
            <Paragraph>{t('cookie.page.p1')}</Paragraph>
            <Paragraph>{t('cookie.page.p2')}</Paragraph>
            <GovUK.Heading size="M" as="h2" id="heading-essential-cookies">
              {t('cookie.page.essentialHeading')}
            </GovUK.Heading>
            <Paragraph>{t('cookie.page.p3')}</Paragraph>
            <GovUK.Table
              aria-describedby="heading-essential-cookies"
              head={
                <GovUK.Table.Row>
                  <GovUK.Table.CellHeader scope="col" setWidth="36%">
                    {t('cookie.page.name')}
                  </GovUK.Table.CellHeader>
                  <GovUK.Table.CellHeader scope="col">
                    {t('cookie.page.purpose')}
                  </GovUK.Table.CellHeader>
                  <GovUK.Table.CellHeader scope="col">
                    {t('cookie.page.expires')}
                  </GovUK.Table.CellHeader>
                </GovUK.Table.Row>
              }
            >
              <GovUK.Table.Row>
                <GovUK.Table.Cell>
                  _Secure-next-auth.callback-url
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.secureNextPurpose')}
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.secureNextExpires')}
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <GovUK.Table.Cell>_Host-next-auth.csrf-token</GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.hostNextPurpose')}
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.hostNextExpires')}
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <GovUK.Table.Cell>
                  _Secure-next-auth.session-token.0
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.secureToken0Purpose')}
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.secureToken0Expires')}
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <GovUK.Table.Cell>
                  _Secure-next-auth.session-token.1
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.secureToken1Purpose')}
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.secureToken1Expires')}
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <GovUK.Table.Cell>NEXT_LOCALE</GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.NextLocalePurpose')}
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  {t('cookie.page.NextLocaleExpires')}
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
            </GovUK.Table>
            <GovUK.Heading size="M" as="h2" id="heading-essential-cookies">
              {t('cookie.page.changeSettings')}
            </GovUK.Heading>
            <form onSubmit={handleSave}>
              <GovUK.Fieldset>
                <GovUK.MultiChoice mb={6} label="">
                  <GovUK.Fieldset.Legend mb={5} size="S">
                    {t('cookie.page.analytics.heading')}
                  </GovUK.Fieldset.Legend>
                  <Radio
                    name="radios-analytics"
                    value="true"
                    checked={analyticsConsent}
                    onChange={() => setAnalyticsConsent(true)}
                  >
                    {t('cookie.page.analytics.yes')}
                  </Radio>
                  <Radio
                    name="radios-analytics"
                    value="false"
                    checked={!analyticsConsent}
                    onChange={() => setAnalyticsConsent(false)}
                  >
                    {t('cookie.page.analytics.no')}
                  </Radio>
                </GovUK.MultiChoice>
              </GovUK.Fieldset>
              <ButtonGroup>
                <GovUK.Button id="saveButton">
                  {t('cookieSaveButton')}
                </GovUK.Button>
              </ButtonGroup>
            </form>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default Cookies;
