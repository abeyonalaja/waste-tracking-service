import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {

    Breadcrumbs,
    Heading,
    Main,
    GridCol,
    GridRow
    
  } from "govuk-react";
import {CompleteHeader} from '../../components/CompleteHeader'
import {CompleteFooter} from '../../components/CompleteFooter'  

  
  export function TemplateSubmitCSV() {

    const { t } = useTranslation();

    return (
      
<div>

<CompleteHeader />
<Main>
    
    <Breadcrumbs>
      <Breadcrumbs.Link href="/">
      {t('app.title')}
      </Breadcrumbs.Link>
      <Breadcrumbs.Link href="/dashboard">
      {t('app.channel.title')}
      </Breadcrumbs.Link>
      {t('templateSubmitCSV.breadcrumb')}
    </Breadcrumbs>
  
    
  </Main>
    <Main>


  <GridRow>
      <GridCol setWidth="two-thirds">
   
        <Heading size="MEDIUM" id="template-heading">
        {t('templateSubmitCSV.title')}
        </Heading>
      
      </GridCol>
  </GridRow>
   
    </Main>
    <CompleteFooter />
     
    </div>  
     
    );
  }
  
  export default TemplateSubmitCSV;
  