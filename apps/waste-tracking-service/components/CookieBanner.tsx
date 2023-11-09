import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';
import { GREY_3 } from 'govuk-colours';
import { Button, Main, GridRow, GridCol, Heading } from 'govuk-react';
import { AppLink, ButtonGroup, Paragraph } from './index';
import { add } from 'date-fns';
import { useTranslation, Trans } from 'react-i18next';

const Wrap = styled.div`
  padding-top: 20px;
  border-bottom: 10px solid rgba(0, 0, 0, 0);
  background-color: ${GREY_3};
`;

const Message = styled(Main)`
  padding: 0;
  margin-bottom: -10px;
`;

export const CookieBanner = () => {
  const { t } = useTranslation();
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(null);
  const cookieName = process.env.NX_COOKIE_CONSENT_NAME;
  const [cookies, setCookie] = useCookies([cookieName]);

  useEffect(() => {
    if (cookies['cookieConsent']) {
      setIsBannerVisible(false);
    }
  }, []);

  useEffect(() => {
    if (analyticsConsent !== null) {
      const cookieValue: string = JSON.stringify({
        analytics: analyticsConsent,
        version: 1,
      });
      setCookie(cookieName, cookieValue, {
        path: '/',
        sameSite: true,
        expires: add(new Date(), {
          years: 1,
        }),
      });
    }
  }, [analyticsConsent]);

  return (
    isBannerVisible && (
      <Wrap role="region" aria-label={t(`cookie.banner.title`)}>
        <Message>
          {analyticsConsent === null ? (
            <>
              <GridRow>
                <GridCol setWidth="two-thirds">
                  <Heading as="h2" size="M" id="cookie-banner-heading">
                    {t(`cookie.banner.title`)}
                  </Heading>
                  <Paragraph id="cookie-banner-p1">
                    {t(`cookie.banner.p1`)}
                  </Paragraph>
                  <Paragraph id="cookie-banner-p2">
                    {t(`cookie.banner.p2`)}
                  </Paragraph>
                </GridCol>
              </GridRow>
              <ButtonGroup>
                <Button type="button" onClick={() => setAnalyticsConsent(true)}>
                  {t(`cookie.banner.button.accept`)}
                </Button>
                <Button
                  type="button"
                  onClick={() => setAnalyticsConsent(false)}
                >
                  {t(`cookie.banner.button.reject`)}
                </Button>
                <AppLink href={{ pathname: '/help/cookies' }}>
                  {t(`cookie.banner.button.link`)}
                </AppLink>
              </ButtonGroup>
            </>
          ) : (
            <>
              <GridRow>
                <GridCol setWidth="two-thirds">
                  <Paragraph
                    id={`cookie-banner-confirmation-${
                      analyticsConsent ? 'approved' : 'rejected'
                    }`}
                  >
                    <Trans
                      i18nKey="cookie.banner.confirmation"
                      context={analyticsConsent ? 'approved' : 'rejected'}
                    >
                      You have accepted analytics cookies. You can{' '}
                      <AppLink href={{ pathname: '/help/cookies' }}>
                        change your cookie settings
                      </AppLink>{' '}
                      at any time.
                    </Trans>
                  </Paragraph>
                  <Button
                    type="button"
                    onClick={() => setIsBannerVisible(false)}
                  >
                    {t(`cookie.banner.button.hide`)}
                  </Button>
                </GridCol>
              </GridRow>
            </>
          )}
        </Message>
      </Wrap>
    )
  );
};
