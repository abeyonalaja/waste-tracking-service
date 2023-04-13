import React from 'react';
import styled from 'styled-components';
import CrownIcon from '@govuk-react/icon-crown';
import {
  GlobalStyle,
  Main,
  TopNav,
  Link,
  PhaseBanner,
} from 'govuk-react';

const PhaseBannerStyled = styled(PhaseBanner)`
  margin-top: -30px;
`;

export const CompleteHeader = () => {
  return (
    <>
      <GlobalStyle />
      <header>
        <TopNav
          company={
            <TopNav.Anchor href="https://www.gov.uk/" target="_blank">
              <TopNav.IconTitle icon={<CrownIcon height="32" width="36" />}>
                GOV.UK
              </TopNav.IconTitle>
            </TopNav.Anchor>
          }
          serviceTitle={
            <TopNav.NavLink href="/">Export green list waste</TopNav.NavLink>
          }
        />
        <Main>
          <PhaseBannerStyled level="Private beta">
            This part of GOV.UK is being rebuilt –{' '}
            <Link href="https://example.com" noVisitedState>
              find out what that means
            </Link>
          </PhaseBannerStyled>
        </Main>
      </header>
    </>
  );
};
