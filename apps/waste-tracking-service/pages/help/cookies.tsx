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
import React, { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { Radio } from 'govuk-react';
import { useCookies } from 'react-cookie';
import { add } from 'date-fns';

const Cookies = () => {
  const { t } = useTranslation();
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const cookieName = process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME;
  const [cookies, setCookie] = useCookies([cookieName]);

  useEffect(() => {
    if (cookies[cookieName]) {
      setAnalyticsConsent(cookies[cookieName].analytics);
    } else {
      setAnalyticsConsent(false);
    }
  }, [cookies]);

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
    setShowNotification(true);
    window.scrollTo(0, 0);
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
            {showNotification && (
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
                    Name
                  </GovUK.Table.CellHeader>
                  <GovUK.Table.CellHeader scope="col">
                    Purpose
                  </GovUK.Table.CellHeader>
                  <GovUK.Table.CellHeader scope="col">
                    Expires
                  </GovUK.Table.CellHeader>
                </GovUK.Table.Row>
              }
            >
              <GovUK.Table.Row>
                <GovUK.Table.Cell>next-auth.callback-url</GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  To check who you are and give you access to the service
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  When you log out or leave the service
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <GovUK.Table.Cell>next-auth.csrf-token</GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  To check who you are and give you access to the service
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  When you log out or leave the service
                </GovUK.Table.Cell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <GovUK.Table.Cell>next-auth.session-token</GovUK.Table.Cell>
                <GovUK.Table.Cell>
                  To check who you are and give you access to the service
                </GovUK.Table.Cell>
                <GovUK.Table.Cell>15 minutes</GovUK.Table.Cell>
              </GovUK.Table.Row>
            </GovUK.Table>
            <form onSubmit={handleSave}>
              <GovUK.Fieldset>
                <GovUK.MultiChoice mb={6} label="">
                  <GovUK.Fieldset.Legend size="M">
                    {t('cookie.page.analyticHeading')}
                  </GovUK.Fieldset.Legend>
                  <Radio
                    name="radios-analytics"
                    value="true"
                    checked={analyticsConsent}
                    onChange={() => setAnalyticsConsent(true)}
                  >
                    Use cookies that measure my website use
                  </Radio>
                  <Radio
                    name="radios-analytics"
                    value="false"
                    checked={!analyticsConsent}
                    onChange={() => setAnalyticsConsent(false)}
                  >
                    Do not use cookies that measure my website use
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
