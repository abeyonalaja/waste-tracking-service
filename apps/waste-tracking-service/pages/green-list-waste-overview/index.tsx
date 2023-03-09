import styled from 'styled-components'
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {

  Breadcrumbs,
  Page,
  Footer,
  Heading,
  Main,
  Link,
  H4,
  PhaseBanner
  
} from "govuk-react";

const Paragraph = styled.div`
  margin-bottom: 20px;
`
const PhaseBannerStyled = styled(PhaseBanner)`
  margin-top: -25px;
`;

export function Index() {

  const { t } = useTranslation();

  return (
    
<Page>
 
<PhaseBannerStyled level={t('tag')}>
  This part of GOV.UK is being rebuilt –{' '}
  <Link href="https://example.com">
    find out what that means
  </Link>
</PhaseBannerStyled>
 
  

  <Breadcrumbs>
    <Breadcrumbs.Link href="/">
    {t('app.title')}
    </Breadcrumbs.Link>
    {t('app.channel.title')}
  </Breadcrumbs>



  <Main>
    <Heading size="LARGE">
    {t('greenListOverview.heading')}
  </Heading>


    <H4>
    {t('greenListOverview.tellExport.heading')}
    </H4>
    
                
    <Paragraph>
      <Link href="green-list-waste-overview/your-reference" id="your-reference">{t('greenListOverview.tellExport.linkOne')}</Link>
    </Paragraph>        
    <Paragraph>
    <Link href="green-list-waste-overview/template-submit-export" id="template-submit-export">{t('greenListOverview.tellExport.linkTwo')}</Link>
    </Paragraph>  
    <Paragraph>
    <Link href="green-list-waste-overview/template-submit-csv" id="template-submit-csv">{t('greenListOverview.tellExport.linkThree')}</Link>
    </Paragraph>  
    <Paragraph>
    <Link href="green-list-waste-overview/draft-export" id="draft-export">{t('greenListOverview.tellExport.linkFour')} (6)</Link>
    </Paragraph>  

    <H4>
    {t('greenListOverview.allExport.heading')}
    </H4>

    <Paragraph>
    <Link href="green-list-waste-overview/update-export-with-actual-details" id="update-export-with-actual-details">{t('greenListOverview.allExport.linkOne')} (6)</Link>
    </Paragraph>        
    <Paragraph>
    <Link href="green-list-waste-overview/check-all-submitted-exports" id="check-all-submitted-exports">{t('greenListOverview.allExport.linkTwo')} (20)</Link>
    </Paragraph>  
    
    <H4>
    {t('greenListOverview.allExport.heading')}
    </H4>

    <Paragraph>
    <Link href="green-list-waste-overview/create-new-template" id="create-new-template">{t('greenListOverview.templates.linkOne')}</Link>
    </Paragraph>        
    <Paragraph>
    <Link href="green-list-waste-overview/manage-your-template" id="manage-your-template">{t('greenListOverview.templates.linkTwo')}</Link>
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
