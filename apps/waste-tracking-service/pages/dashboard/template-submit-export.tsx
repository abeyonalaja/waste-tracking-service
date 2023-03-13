import styled from 'styled-components'
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {CompleteHeader} from '../../components/CompleteHeader'
import {CompleteFooter} from '../../components/CompleteFooter'
import {

    BackLink,
    Page,
    Heading,
    Main,


  } from "govuk-react";
  
 
  
  export function TemplateSubmitExport() {

    const { t } = useTranslation();

    return (
      
<div>

  <CompleteHeader />
  <Main>
    
    <BackLink onClick={function noRefCheck(){history.back()}}>
    {t('back')}
    </BackLink>
  
    <Heading size="MEDIUM" id="template-heading">
    {t('templateSubmitExport.title')}
    </Heading>
  
   
  
  
   
  </Main>
  <CompleteFooter />


</div> 
     
    );
  }
  
  export default TemplateSubmitExport;
  