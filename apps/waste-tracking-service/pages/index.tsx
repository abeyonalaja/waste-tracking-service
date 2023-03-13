import styled from 'styled-components'
import '../i18n/config';
import { useTranslation } from 'react-i18next';

import {

   Breadcrumbs, Page, Footer, Tag, SectionBreak, Main, Link, PhaseBanner
  
} from "govuk-react";
import {CompleteHeader} from '../components/CompleteHeader'
import {CompleteFooter} from '../components/CompleteFooter'

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
    {t('app.title')}
  </Breadcrumbs>

  </Main>
  <Main>


  <Paragraph>
    <Link href="green-list-waste-overview">{t('app.channel.title')}</Link>
  </Paragraph>
           

  </Main>

  <CompleteFooter />


  </div>

  
   
   
  );
}

export default Index;
