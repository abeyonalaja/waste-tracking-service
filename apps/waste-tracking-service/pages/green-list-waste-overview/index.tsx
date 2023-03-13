import styled from 'styled-components'
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {CompleteHeader} from '../../components/CompleteHeader'
import {CompleteFooter} from '../../components/CompleteFooter'

import {

  Breadcrumbs,
  Heading,
  Main,
  Link,
  H4,
  
} from "govuk-react";

const Paragraph = styled.div`
  margin-bottom: 20px;
`


export function Index() {

  const { t } = useTranslation();

  return (
    
<div>

<CompleteHeader />
 

 
  
<Main>
  <Breadcrumbs>
    <Breadcrumbs.Link href="/">
    {t('app.title')}
    </Breadcrumbs.Link>
    {t('app.channel.title')}
  </Breadcrumbs>



  
  <Heading size="LARGE" role="heading">
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

  <CompleteFooter />


  </div>

  
   
      
   
  );
}

export default Index;
