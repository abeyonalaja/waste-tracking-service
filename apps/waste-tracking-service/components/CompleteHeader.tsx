import React from 'react';
import styled from 'styled-components';
import CrownIcon from '@govuk-react/icon-crown';
import { GlobalStyle, Main, TopNav, PhaseBanner } from 'govuk-react';
import Link from 'next/link';
import { BLUE, BLACK, YELLOW } from 'govuk-colours';
import { useTranslation } from 'react-i18next';
import { CookieBanner, LanguageSwitch } from 'components';

const GovukHeader = styled.header`
  background: ${BLACK};
  font-weight: 400;
  font-size: 14px;
  line-height: 1.15;
  border-bottom: 10px solid #fff;
  color: #fff;
  @media (min-width: 40.0625em) {
    font-size: 16px;
  }
`;

const GovukHeaderInner = styled.div`
  max-width: 960px;
  margin-right: 15px;
  margin-left: 15px;
  position: relative;
  margin-bottom: -10px;
  padding-top: 10px;
  border-bottom: 10px solid ${BLUE};
  @media (min-width: 40.0625em) {
    margin-right: 30px;
    margin-left: 30px;
  }
  @media (min-width: 48.0625em) {
    display: flex;
    align-items: center;
  }
  @media (min-width: 1020px) {
    margin-right: auto;
    margin-left: auto;
  }
`;

const GovukHeaderLogo = styled.div`
  margin-bottom: 5px;
  font-size: 30px;
  @media (min-width: 48.0625em) {
    width: 33%;
    margin-bottom: 10px;
  }
`;

const GovukHeaderContent = styled.div`
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 700;
  @media (min-width: 40.0625em) {
    font-size: 24px;
  }
`;

const GovukHeaderUserContent = styled.div`
  padding-bottom: 10px;
  font-size: 14px;
  display: flex;
  gap: 15px;
  align-items: baseline;
  display: none; /* Remove this after DCID */
  @media (min-width: 40.0625em) {
    font-size: 16px;
    margin-left: auto;
    gap: 20px;
  }
`;

const GovukHeaderLogoLink = styled(TopNav.Anchor)`
  display: inline-block;
  &:active,
  &:hover {
    margin-bottom: -3px;
    border-bottom: 3px solid;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: #0b0c0c;
    background-color: ${YELLOW};
    box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    @media (min-width: 40.0625em) {
      box-shadow: 0 0 ${YELLOW};
    }
  }
`;

const GovukHeaderLink = styled(Link)`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: none;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.1em;
  color: #fff;
  font-weight: inherit;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    line-height: 1.3;
  }
  &:visited,
  &:link {
    color: #fff;
  }
  &:hover {
    text-decoration: underline;
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    text-decoration-skip-ink: none;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow: 0 -2px ${YELLOW}, 0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

const PhaseBannerStyled = styled(PhaseBanner)`
  margin-top: -30px;
`;

export const CompleteHeader = () => {
  const { t } = useTranslation();
  return (
    <>
      <GlobalStyle />
      <CookieBanner />
      <GovukHeader>
        <GovukHeaderInner>
          <GovukHeaderLogo>
            <GovukHeaderLogoLink href="https://www.gov.uk/" target="_blank">
              <TopNav.IconTitle icon={<CrownIcon height="32" width="36" />}>
                {t('header.iconTitle')}
              </TopNav.IconTitle>
            </GovukHeaderLogoLink>
          </GovukHeaderLogo>
          <GovukHeaderContent>
            <GovukHeaderLink href={{ pathname: '/' }}>
              {t('app.title')}
            </GovukHeaderLink>
          </GovukHeaderContent>
          <GovukHeaderUserContent />
        </GovukHeaderInner>
      </GovukHeader>
      <Main>
        <PhaseBannerStyled level={t('tag')}>
          {t('header.serviceBanner')}
        </PhaseBannerStyled>
        <LanguageSwitch />
      </Main>
    </>
  );
};
