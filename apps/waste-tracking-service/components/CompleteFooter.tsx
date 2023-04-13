import React from 'react';
import styled from 'styled-components';

import { Footer } from 'govuk-react';

const FooterLink = styled(Footer.Link)`
  display: inline-block;
  margin-bottom: 20px;
  margin-right: 20px;
`;

export const CompleteFooter = () => {
  return (
    <>
      <Footer
        meta={
          <>
            <FooterLink href="https://design-system.service.gov.uk/accessibility/">
              Accessibility statement
            </FooterLink>
            <FooterLink href="/cookies">Cookies</FooterLink>
            <FooterLink href="/">Privacy notice</FooterLink>
            <Footer.MetaCustom>
              Built by the{' '}
              <FooterLink href="/">Government Digital Service</FooterLink>
            </Footer.MetaCustom>
          </>
        }
        copyright={{
          image: {
            height: 102,
            src: 'https://www.gov.uk/assets/static/govuk-crest-87038e62e594b5f83ea40e0fb480fe7a5f41ba0db3917f709dfb39043f19a0f7.png',
            width: 125,
          },
          link: 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
          text: 'Crown copyright',
        }}
      />
    </>
  );
};
