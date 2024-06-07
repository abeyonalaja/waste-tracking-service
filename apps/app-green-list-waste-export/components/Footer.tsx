import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import * as GovUK from 'govuk-react';
import { BLACK, YELLOW } from 'govuk-colours';
import { useTranslation } from 'react-i18next';

const FooterLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  margin-right: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.1em;
  color: ${BLACK};
  font-weight: 400;
  font-size: 14px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    font-size: 16px;
    line-height: 1.3;
  }
  &:hover {
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    text-decoration-skip-ink: none;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow:
      0 -2px ${YELLOW},
      0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

export const Footer = (): React.ReactNode => {
  const { t } = useTranslation();
  return (
    <>
      <GovUK.Footer
        meta={
          <>
            <FooterLink href={{ pathname: '/help/accessibility' }}>
              {t('footer.accessibility')}
            </FooterLink>
            <FooterLink href={{ pathname: '/help/cookies' }}>
              {t('footer.cookies')}
            </FooterLink>
            <FooterLink href={{ pathname: '/help/privacy' }}>
              {t('footer.privacy')}
            </FooterLink>
            <GovUK.Footer.MetaCustom>
              {t('footer.metaCustom')}
            </GovUK.Footer.MetaCustom>
          </>
        }
        copyright={{
          image: {
            height: 102,
            src: 'https://www.gov.uk/assets/static/govuk-crest-87038e62e594b5f83ea40e0fb480fe7a5f41ba0db3917f709dfb39043f19a0f7.png',
            width: 125,
          },
          link: 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
          text: t('footer.crownCopyright'),
        }}
      />
    </>
  );
};
