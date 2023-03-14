import React, { Component } from 'react';
import styled from 'styled-components';
import CrownIcon from '@govuk-react/icon-crown';
import { GlobalStyle, Main, TopNav, Link, PhaseBanner } from 'govuk-react';

const PhaseBannerStyled = styled(PhaseBanner)`
  margin-top: -25px;
`;

const TopNavStyled = styled(TopNav)`
  .logo-search-wrapper {
    max-width: 200px;
  }

  .src__ServiceTitleWrapper-sc-140rlix-0 {
    float: left;
  }

  .src__MenuButtonWrapper-sc-140rlix-1 .eLocyj {
    -webkit-flex-direction: row;
  }
`;

const TopNavAnchor = styled(TopNav.Anchor)`
  max-width: 240px !important;
`;

export class CompleteHeader extends Component {
  render() {
    return (
      <>
        <GlobalStyle />
        <TopNavStyled
          company={
            <TopNavAnchor href="https://example.com" target="new">
              <TopNav.IconTitle icon={<CrownIcon height="32" width="36" />}>
                GOV.UK
              </TopNav.IconTitle>
            </TopNavAnchor>
          }
          serviceTitle={
            <TopNav.NavLink
              href="https://example.com"
              target="new"
              aria-roledescription="heading"
            >
              Export green list waste
            </TopNav.NavLink>
          }
        ></TopNavStyled>
        <Main>
          <PhaseBannerStyled level="PRIVATE BETA">
            This part of GOV.UK is being rebuilt –{' '}
            <Link href="https://example.com">find out what that means</Link>
          </PhaseBannerStyled>
        </Main>
      </>
    );
  }
}
export default CompleteHeader;
