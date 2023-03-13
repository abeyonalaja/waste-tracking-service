import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {

     Breadcrumbs,
     Heading,
     Main,
     GridRow,
     GridCol,
    
  } from "govuk-react";
  import {CompleteHeader} from '../../components/CompleteHeader'
  import {CompleteFooter} from '../../components/CompleteFooter'  

  
  
  export function AllSumbittedExports() {

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
      {t('checkAllSubmittedExports.breadcrumb')}
    </Breadcrumbs>
  
    
  </Main>
    <Main>


  <GridRow>
      <GridCol setWidth="two-thirds">
  
    
      <Heading size="MEDIUM" id="template-heading">
        {t('checkAllSubmittedExports.title')}
        </Heading>
      
      </GridCol>
  </GridRow>
  
  
   

    </Main>
    <CompleteFooter />
     
    </div>    
     
    );
  }
  export default AllSumbittedExports;
  