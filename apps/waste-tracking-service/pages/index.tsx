import styled from 'styled-components'
import '../i18n/config';
import { useTranslation } from 'react-i18next';

import {

   Breadcrumbs, Page, Footer, Tag, SectionBreak, Main, Link, PhaseBanner
  
} from "govuk-react";

const Paragraph = styled.div`
  margin-bottom: 20px;
`

export function Index() {

  const { t } = useTranslation();

  return (
    
<Page>

<PhaseBanner level={t('tag')}>
  This part of GOV.UK is being rebuilt –{' '}
  <Link href="https://example.com">
    find out what that means
  </Link>
</PhaseBanner>
 
  

  <SectionBreak
    level="LARGE"
    visible
  />
  <Breadcrumbs>
  {t('app.title')}
 
    
  </Breadcrumbs>


  <Main>


  <Paragraph>
    <Link href="green-list-waste-overview">{t('app.channel.title')}</Link>
  </Paragraph>
           


  </Main>

  <Footer
   meta={<><Footer.Link href="/">Accessibility statement</Footer.Link><Footer.Link href="/footer-meta-item-2">Cookies</Footer.Link><Footer.Link href="/">Privacy notice</Footer.Link><Footer.MetaCustom>Built by the{' '}<Footer.Link href="/">Government Digital Service</Footer.Link></Footer.MetaCustom></>}
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
  </Page>

  
   
      
   
  );
}

export default Index;
