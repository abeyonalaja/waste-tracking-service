import React, { Component } from 'react';
import styled from 'styled-components'

import {

  Footer
  
} from "govuk-react";

const FooterLink = styled(Footer.Link)`
display: inline-block;
  margin-bottom: 20px;
  margin-right: 20px;
 
`;

export  class CompleteFooter extends Component {

  

  render() {

    
    return(
      <>
  <Footer
   meta={<><FooterLink href="https://design-system.service.gov.uk/accessibility/">Accessibility statement</FooterLink><FooterLink href="/cookies">Cookies</FooterLink><FooterLink href="/">Privacy notice</FooterLink><Footer.MetaCustom>Built by the{' '}<FooterLink href="/">Government Digital Service</FooterLink></Footer.MetaCustom></>}
  copyright={{
    image: {
      height: 102,
      src: "https://www.gov.uk//assets/static/govuk-crest-2x-f88404651d3e759ad54ebb8fa59ce10dafa0f8788571c8a9adc7597dd9823220.png",
      width: 125
    },
    link: 'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
    text: 'Crown copyright'
  }}
/>
</>
    )
  }

}
